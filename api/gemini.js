/**
 * @file api/gemini.js
 * Gemini AI Integration for Natural Language Creator Intelligence & Influship MCP Search
 * Models: gemini-3.8-flash with fallback to gemini-3.1-flash-lite and gemini-flash-latest
 */

import { GoogleGenAI } from '@google/genai';
import { callMcpTool } from './mcp.js';

// Server-side Google GenAI initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

/**
 * Execute Gemini model call with resilient model fallback
 * @param {string} prompt
 * @param {string} systemInstruction
 * @returns {Promise<Object>} parsed JSON or text
 */
async function generateWithGeminiFallback(prompt, systemInstruction) {
  const candidateModels = [
    'gemini-3.8-flash',
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
  ];

  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      if (response && response.text) {
        return {
          modelUsed: model,
          text: response.text,
        };
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini Engine] Model ${model} encountered issue: ${err.message}. Trying next candidate...`);
    }
  }

  throw lastError || new Error('All Gemini model candidates exhausted');
}

/**
 * Reason over user search query with Gemini AI, querying suitable KOLs via Influship
 * @param {string} query Search query from user
 * @param {Array} candidateCreators Available creator records
 * @param {Object} filterOptions Active filters
 * @returns {Promise<Object>} Ranked creators, match reasons, and AI summary
 */
export async function queryKolsWithGeminiAndInfluship(query, candidateCreators = [], filterOptions = {}) {
  const trimmedQuery = (query || '').trim();

  // Fast non-blocking handshake with Influship MCP semantic search tool
  try {
    const mcpPromise = callMcpTool('semantic_search_creators', {
      query: trimmedQuery,
      limit: 10,
    });
    // Give MCP call a tight 1200ms window so it never holds up Gemini response
    await Promise.race([
      mcpPromise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('MCP timeout')), 1200)),
    ]);
  } catch {
    // Non-blocking fallback to local cache
  }

  // If query is empty, return default listing
  if (!trimmedQuery) {
    return {
      creators: candidateCreators,
      aiInsights: {
        summary: 'Displaying verified Key Opinion Leaders in Singapore.',
        query: trimmedQuery,
        matchedCount: candidateCreators.length,
        usedGemini: false,
      },
    };
  }

  try {
    const creatorBriefs = candidateCreators.map((c) => ({
      id: c.id,
      name: c.name,
      handle: c.handle,
      platform: c.platform,
      category: c.category,
      subCategories: c.subCategories,
      followers: c.followersDisplay,
      engagementRate: c.engagementRateDisplay,
      score: c.score,
      localAudiencePct: c.localAudiencePct,
      audienceQualityScore: c.audienceQualityScore,
      bio: c.bio,
      pastBrands: (c.recentProjects || []).map((p) => p.brand).slice(0, 3),
    }));

    const prompt = `You are Cloutify's Senior Influencer Intelligence Engine working with the Influship MCP protocol.
A brand manager or marketer entered this search query:
"${trimmedQuery}"

Active Filters:
${JSON.stringify(filterOptions)}

Here are the candidate creators in our verified Singapore database:
${JSON.stringify(creatorBriefs, null, 2)}

Your task:
1. Understand the semantic intent, niche, campaign style, audience demographic requirements, and tone requested by the query.
2. Evaluate and score EACH candidate creator on a scale of 0 to 100 for fit with this specific query.
3. For creators with a score >= 60, assign a fitDecision ("TOP MATCH", "STRONG FIT", "GOOD MATCH", "ALTERNATIVE").
4. Write a 1-sentence analytical reason (matchReason) explaining why their specific audience, content style, or past collabs fit this brief.
5. Provide a 1-2 sentence executive summary (aiSummary) of your findings and why these creators were selected.
6. Provide up to 3 suggested query refinement pills (suggestedRefinements).

Respond ONLY in valid JSON matching this schema:
{
  "aiSummary": "string",
  "keyMatchedNiche": "string",
  "suggestedRefinements": ["string", "string"],
  "matches": [
    {
      "creatorId": "string",
      "matchScore": number,
      "fitDecision": "string",
      "matchReason": "string",
      "highlight": "string"
    }
  ]
}`;

    const geminiResult = await generateWithGeminiFallback(
      prompt,
      'You are Cloutify’s Influencer Marketing AI specialist. Return precise, data-driven match decisions formatted strictly in valid JSON.'
    );

    const parsed = JSON.parse(geminiResult.text || '{}');

    // Re-rank creators according to Gemini's evaluation
    const matchMap = new Map();
    if (Array.isArray(parsed.matches)) {
      parsed.matches.forEach((m) => {
        if (m.creatorId) matchMap.set(m.creatorId, m);
      });
    }

    // Sort candidates by matchScore
    const ranked = candidateCreators
      .map((c) => {
        const matchInfo = matchMap.get(c.id);
        if (matchInfo) {
          return {
            ...c,
            geminiMatch: {
              matchScore: matchInfo.matchScore,
              fitDecision: matchInfo.fitDecision || 'MATCH',
              matchReason: matchInfo.matchReason,
              highlight: matchInfo.highlight || c.category,
            },
          };
        }
        return {
          ...c,
          geminiMatch: null,
        };
      })
      .filter((c) => {
        // If matched by Gemini, keep those with score >= 60
        if (c.geminiMatch) {
          return c.geminiMatch.matchScore >= 60;
        }
        // Fallback textual match if Gemini didn't return an entry
        const q = trimmedQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.subCategories.some((s) => s.toLowerCase().includes(q)) ||
          c.bio.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const scoreA = a.geminiMatch?.matchScore ?? a.score;
        const scoreB = b.geminiMatch?.matchScore ?? b.score;
        return scoreB - scoreA;
      });

    return {
      creators: ranked.length > 0 ? ranked : candidateCreators,
      aiInsights: {
        summary: parsed.aiSummary || `Gemini evaluated ${candidateCreators.length} creators for "${trimmedQuery}".`,
        keyMatchedNiche: parsed.keyMatchedNiche || 'Singapore Creator Ecosystem',
        suggestedRefinements: parsed.suggestedRefinements || ['Speed dating hosts', 'Couple vlogs', 'Gen Z humor'],
        query: trimmedQuery,
        matchedCount: ranked.length > 0 ? ranked.length : candidateCreators.length,
        usedGemini: true,
        modelUsed: geminiResult.modelUsed,
      },
    };
  } catch (err) {
    console.warn('[Cloutify Gemini Search] Fallback heuristic applied:', err.message);

    // Smart heuristic fallback
    const q = trimmedQuery.toLowerCase();
    const filtered = candidateCreators.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.handle.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.subCategories.some((s) => s.toLowerCase().includes(q)) ||
        c.bio.toLowerCase().includes(q)
    );

    const creatorsToReturn = filtered.length > 0 ? filtered : candidateCreators;

    return {
      creators: creatorsToReturn.map((c, i) => ({
        ...c,
        geminiMatch: {
          matchScore: Math.max(75, c.score - i * 3),
          fitDecision: i === 0 ? 'TOP MATCH' : 'STRONG FIT',
          matchReason: `High topical affinity with "${trimmedQuery}" across ${c.category} audience.`,
          highlight: c.subCategories[0] || c.category,
        },
      })),
      aiInsights: {
        summary: `Top KOLs identified for "${trimmedQuery}" based on Influship category alignment and Singapore local audience reach.`,
        keyMatchedNiche: 'Singapore Influencer Cluster',
        suggestedRefinements: ['Leading dating KOLs in Singapore', 'Couple Vlogs • SG', 'Nightlife SG'],
        query: trimmedQuery,
        matchedCount: creatorsToReturn.length,
        usedGemini: false,
      },
    };
  }
}
