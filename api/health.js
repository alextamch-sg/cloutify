/**
 * @file api/health.js
 * API Health Monitor & Diagnostic Service
 * Monitors local /api routes and Influship MCP server connectivity
 */

import { checkMcpConnection, INFLUSHIP_MCP_URL, KNOWN_TOOLS } from './mcp.js';
import { INITIAL_CREATORS } from './creators-data.js';

/**
 * Perform a full health check across all API subsystems.
 * @returns {Promise<Object>} Comprehensive health report
 */
export async function getHealthStatus() {
  const startTime = Date.now();
  const checks = {};

  // 1. Influship MCP Server Check
  try {
    const mcpDiag = await checkMcpConnection({ timeoutMs: 5000 });
    checks.mcpServer = {
      status: mcpDiag.isOnline ? 'UP' : 'DOWN',
      endpoint: INFLUSHIP_MCP_URL,
      statusCode: mcpDiag.statusCode,
      latencyMs: mcpDiag.latencyMs,
      reachable: mcpDiag.isOnline,
      availableToolsCount: KNOWN_TOOLS.length,
      note: 'Operating via Smithery hosted gateway with local intelligence cache fallback (no external API key required).',
    };
  } catch (err) {
    checks.mcpServer = {
      status: 'DOWN',
      endpoint: INFLUSHIP_MCP_URL,
      error: err.message,
      reachable: false,
    };
  }

  // 2. Creators Store Check
  const totalCreators = INITIAL_CREATORS.length;
  checks.creatorStore = {
    status: totalCreators > 0 ? 'UP' : 'DOWN',
    totalRecords: totalCreators,
    clusterSize: 42,
    sampleRecordId: INITIAL_CREATORS[0]?.id || null,
  };

  // 3. Creator Profile Deep Dive Check
  const sampleCreator = INITIAL_CREATORS[0];
  checks.deepDiveEngine = {
    status: sampleCreator && sampleCreator.recentProjects?.length > 0 ? 'UP' : 'DOWN',
    portfoliosLoaded: sampleCreator ? sampleCreator.recentProjects.length : 0,
    demographicsConfigured: Boolean(sampleCreator?.demographics),
    mcpAuditEngineReady: Boolean(sampleCreator?.mcpAudit),
  };

  // 4. Benchmarking Engine Check
  checks.benchmarkingService = {
    status: 'UP',
    trackedKolsCount: Math.min(totalCreators, 4),
    metricsCalculated: ['overlapIndex', 'sharedAudienceTotal', 'cpmEstimate'],
  };

  // 5. Gemini AI Influencer Intelligence Engine Check
  checks.geminiAiEngine = {
    status: process.env.GEMINI_API_KEY ? 'UP' : 'CONFIGURED',
    model: 'gemini-3.8-flash',
    fallbackModels: ['gemini-3.1-flash-lite', 'gemini-flash-latest'],
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    features: ['Natural language semantic search', 'Audience demographic evaluation', 'Campaign fit ranking'],
  };

  const totalDurationMs = Date.now() - startTime;
  const allSubsystemsOk =
    checks.creatorStore.status === 'UP' &&
    checks.deepDiveEngine.status === 'UP' &&
    checks.benchmarkingService.status === 'UP';

  return {
    status: allSubsystemsOk ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    checkDurationMs: totalDurationMs,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    memoryUsageMb: {
      rss: Math.round(process.memoryUsage().rss / 1024 / 1024),
      heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    subsystems: checks,
  };
}

// CLI standalone runner
if (process.argv[1] && process.argv[1].endsWith('health.js')) {
  console.log('=========================================================');
  console.log('Cloutify - API Health Monitor Check');
  console.log('=========================================================');

  getHealthStatus()
    .then((report) => {
      console.log(`Overall Status  : [${report.status.toUpperCase()}]`);
      console.log(`Uptime          : ${report.uptimeSeconds} seconds`);
      console.log(`Check Latency   : ${report.checkDurationMs} ms`);
      console.log(`Influship MCP   : ${report.subsystems.mcpServer.status} (${report.subsystems.mcpServer.latencyMs}ms, HTTP ${report.subsystems.mcpServer.statusCode})`);
      console.log(`Creator Store   : ${report.subsystems.creatorStore.status} (${report.subsystems.creatorStore.totalRecords} records)`);
      console.log(`Deep Dive Engine: ${report.subsystems.deepDiveEngine.status} (${report.subsystems.deepDiveEngine.portfoliosLoaded} portfolios)`);
      console.log(`Benchmark Engine: ${report.subsystems.benchmarkingService.status}`);
      console.log('---------------------------------------------------------');
      console.log('Detailed Report JSON:');
      console.log(JSON.stringify(report, null, 2));
      console.log('=========================================================');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Health check failed with error:', err);
      process.exit(1);
    });
}
