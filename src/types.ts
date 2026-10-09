/**
 * @file src/types.ts
 * TypeScript models for Cloutify and Influship MCP Intelligence
 */

export interface ScoreBreakdown {
  reach: number;
  sentiment: number;
  conversion: number;
  algorithmConfidence: string;
}

export interface AgeGroup {
  label: string;
  pct: number;
}

export interface GeoLocation {
  country: string;
  pct: number;
}

export interface Demographics {
  gender: {
    female: number;
    male: number;
  };
  ageGroups: AgeGroup[];
  geography: GeoLocation[];
  topInterests: string[];
}

export interface ProjectPortfolio {
  id: string;
  brand: string;
  brandLogo: string;
  title: string;
  campaignType: string;
  date: string;
  thumbnail: string;
  impressions: string;
  reach: string;
  engagementRate: string;
  saves: number;
  shares: number;
  roiScore: number;
  summary: string;
}

export interface PostItem {
  id: string;
  type: string;
  caption: string;
  likes: string;
  comments: string;
  views: string;
  postedAt: string;
  thumbnail: string;
  transcript?: string;
}

export interface McpAudit {
  decision: string;
  matchReason: string;
  brandSafetyScore: number;
  commercialIntentScore: number;
  recommendationRank: number;
}

export interface GeminiMatch {
  matchScore: number;
  fitDecision: string;
  matchReason: string;
  highlight?: string;
}

export interface AiInsights {
  summary: string;
  keyMatchedNiche?: string;
  suggestedRefinements?: string[];
  query: string;
  matchedCount: number;
  usedGemini: boolean;
  modelUsed?: string;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  verified: boolean;
  platform: 'instagram' | 'tiktok' | 'youtube';
  tag: string;
  tagVariant?: string;
  shortlisted: boolean;
  score: number;
  scoreBreakdown: ScoreBreakdown;
  geminiMatch?: GeminiMatch | null;
  category: string;
  subCategories: string[];
  location: string;
  localAudiencePct: number;
  followers: number;
  followersDisplay: string;
  engagementRate: number;
  engagementRateDisplay: string;
  avgImpressions: number;
  avgImpressionsDisplay: string;
  avgEngagement: number;
  avgEngagementDisplay: string;
  timeOnTop: string;
  statusText: string;
  avatar: string;
  coverImage: string;
  bio: string;
  detailedBio: string;
  email: string;
  agency: string;
  languages: string[];
  pricingRange: string;
  audienceQualityScore: number;
  authenticityScore: number;
  lastSyncedAt: string;
  demographics: Demographics;
  mcpAudit: McpAudit;
  recentProjects: ProjectPortfolio[];
  recentPosts: PostItem[];
  syncStatus?: {
    success: boolean;
    source: string;
    server: string;
    timestamp: string;
    latencyMs?: number;
  };
}

export interface McpTool {
  name: string;
  description: string;
}

export interface McpConnectionStatus {
  success: boolean;
  isOnline: boolean;
  isAuthenticated: boolean;
  statusCode: number;
  latencyMs: number;
  endpoint: string;
  server: string;
  requiresAuth: boolean;
  hasApiKeyConfigured: boolean;
  message: string;
  availableTools: McpTool[];
  timestamp: string;
  details?: Record<string, unknown>;
  cachedProfilesCount?: number;
  lastSyncBatchTime?: string;
}
