/**
 * @file src/services/api.ts
 * Frontend API client communicating with backend /api routes and Influship MCP
 */

import { Creator, McpConnectionStatus, AiInsights } from '../types';

export interface GetCreatorsParams {
  q?: string;
  category?: string;
  country?: string;
  minScore?: number;
  minFollowers?: number;
  sort?: string;
  page?: number;
  limit?: number;
  includeInactive?: boolean;
  useAi?: boolean;
}

export interface GetCreatorsResponse {
  data: Creator[];
  meta: {
    total: number;
    clusterTotal: number;
    page: number;
    pageSize: number;
    totalPages: number;
    mcpServer: string;
    lastSyncBatchTime: string;
  };
  aiInsights?: AiInsights | null;
}

export async function searchCreatorsWithAi(params: GetCreatorsParams = {}): Promise<GetCreatorsResponse> {
  const res = await fetch('/api/creators/ai-search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: params.q || '',
      category: params.category,
      country: params.country,
      minScore: params.minScore,
      minFollowers: params.minFollowers,
      sort: params.sort,
      page: params.page,
      limit: params.limit,
      includeInactive: params.includeInactive,
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to search creators with AI: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCreators(params: GetCreatorsParams = {}): Promise<GetCreatorsResponse> {
  const query = new URLSearchParams();
  if (params.q) query.set('q', params.q);
  if (params.category) query.set('category', params.category);
  if (params.country) query.set('country', params.country);
  if (params.minScore) query.set('minScore', params.minScore.toString());
  if (params.minFollowers) query.set('minFollowers', params.minFollowers.toString());
  if (params.sort) query.set('sort', params.sort);
  if (params.page) query.set('page', params.page.toString());
  if (params.limit) query.set('limit', params.limit.toString());
  if (params.includeInactive !== undefined) query.set('includeInactive', params.includeInactive.toString());

  const res = await fetch(`/api/creators?${query.toString()}`);
  if (!res.ok) {
    throw new Error(`Failed to load creators: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchCreatorById(id: string): Promise<Creator> {
  const res = await fetch(`/api/creators/${id}`);
  if (!res.ok) {
    throw new Error(`Creator ${id} not found`);
  }
  const json = await res.json();
  return json.data;
}

export async function syncCreatorProfile(id: string): Promise<{ success: boolean; data: Creator; message: string }> {
  const res = await fetch(`/api/creators/${id}/sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to sync creator profile: ${res.statusText}`);
  }
  return res.json();
}

export async function syncAllCreators(): Promise<{ success: boolean; data: Creator[]; message: string }> {
  const res = await fetch('/api/creators/sync-all', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`Failed to sync all creators: ${res.statusText}`);
  }
  return res.json();
}

export async function toggleShortlist(id: string): Promise<{ success: boolean; shortlisted: boolean; data: Creator }> {
  const res = await fetch(`/api/creators/${id}/shortlist`, {
    method: 'POST',
  });
  if (!res.ok) {
    throw new Error(`Failed to toggle shortlist: ${res.statusText}`);
  }
  return res.json();
}

export async function checkMcpStatus(): Promise<McpConnectionStatus> {
  const res = await fetch('/api/mcp');
  if (!res.ok) {
    throw new Error(`Failed to check MCP status: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchHealthStatus(): Promise<{
  status: string;
  timestamp: string;
  uptimeSeconds: number;
  checkDurationMs: number;
  environment: string;
  nodeVersion: string;
  memoryUsageMb: {
    rss: number;
    heapUsed: number;
    heapTotal: number;
  };
  subsystems: {
    mcpServer: {
      status: string;
      endpoint: string;
      statusCode: number;
      latencyMs: number;
      reachable: boolean;
      availableToolsCount: number;
      note?: string;
    };
    creatorStore: {
      status: string;
      totalRecords: number;
      clusterSize: number;
      sampleRecordId: string;
    };
    deepDiveEngine: {
      status: string;
      portfoliosLoaded: number;
      demographicsConfigured: boolean;
      mcpAuditEngineReady: boolean;
    };
    benchmarkingService: {
      status: string;
      trackedKolsCount: number;
      metricsCalculated: string[];
    };
  };
}> {
  const res = await fetch('/api/health');
  if (!res.ok) {
    throw new Error(`Failed to fetch health status: ${res.statusText}`);
  }
  return res.json();
}

export async function executeMcpTool(toolName: string, params: Record<string, unknown>): Promise<unknown> {
  const res = await fetch('/api/mcp/tool', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ toolName, params }),
  });
  return res.json();
}

export async function fetchBenchmarks(): Promise<{
  comparison: Array<{
    id: string;
    name: string;
    handle: string;
    score: number;
    followers: string;
    engagementRate: string;
    audienceOverlapPct: number;
    cpmEstimate: string;
  }>;
  overlapSummary: {
    sharedAudienceTotal: string;
    overlapIndex: string;
    primarySharedInterest: string;
  };
}> {
  const res = await fetch('/api/benchmarks');
  if (!res.ok) {
    throw new Error('Failed to fetch benchmarks');
  }
  return res.json();
}
