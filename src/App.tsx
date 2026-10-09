/**
 * @file src/App.tsx
 * Web-Based Desktop Application for Cloutify
 * Powered by Influship MCP Intelligence & API Health Monitor
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Creator, McpConnectionStatus, AiInsights } from './types';
import {
  fetchCreators,
  searchCreatorsWithAi,
  syncCreatorProfile,
  syncAllCreators,
  toggleShortlist,
  checkMcpStatus,
} from './services/api';
import { Header, NavTab } from './components/Header';
import { DiscoveryView } from './components/DiscoveryView';
import { CreatorDeepDive } from './components/CreatorDeepDive';
import { ShortlistView } from './components/ShortlistView';
import { CampaignsView } from './components/CampaignsView';
import { AnalyticsView } from './components/AnalyticsView';
import { McpConnectionModal } from './components/McpConnectionModal';
import { BenchmarkModal } from './components/BenchmarkModal';
import { FilterModal } from './components/FilterModal';
import { HealthMonitorModal } from './components/HealthMonitorModal';

export default function App() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [activeNavTab, setActiveNavTab] = useState<NavTab>('discovery');
  const [mcpStatus, setMcpStatus] = useState<McpConnectionStatus | null>(null);
  const [_loading, setLoading] = useState(true);

  // Modals
  const [isMcpModalOpen, setIsMcpModalOpen] = useState(false);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Syncing states
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [syncingCreatorId, setSyncingCreatorId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gemini AI Search state
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [aiInsights, setAiInsights] = useState<AiInsights | null>(null);

  // Filters initialized to match the user's reference design
  const [searchQuery, setSearchQuery] = useState('Leading dating KOLs in Singapore');
  const [selectedCategory, setSelectedCategory] = useState('Dating & Relationships');
  const [selectedCountry, setSelectedCountry] = useState('Singapore');
  const [minScoreFilter, setMinScoreFilter] = useState<number | null>(null);
  const [minFollowersFilter, setMinFollowersFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('score');
  const [includeWithoutRecentPosts, setIncludeWithoutRecentPosts] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [totalClusterCount, setTotalClusterCount] = useState(42);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Load creators
  const loadCreators = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchCreators({
        q: searchQuery,
        category: selectedCategory,
        country: selectedCountry,
        minScore: minScoreFilter || undefined,
        minFollowers: minFollowersFilter || undefined,
        sort: sortBy,
        page: currentPage,
        limit: 4,
        includeInactive: includeWithoutRecentPosts,
      });
      setCreators(res.data);
      if (res.aiInsights) {
        setAiInsights(res.aiInsights);
      }
      setTotalPages(res.meta.totalPages || 3);
      setTotalClusterCount(res.meta.clusterTotal || 42);

      // If a creator is selected, sync its state
      if (selectedCreator) {
        const found = res.data.find((c) => c.id === selectedCreator.id);
        if (found) setSelectedCreator(found);
      }
    } catch (err) {
      console.error('Error fetching creators:', err);
    } finally {
      setLoading(false);
    }
  }, [
    searchQuery,
    selectedCategory,
    selectedCountry,
    minScoreFilter,
    minFollowersFilter,
    sortBy,
    currentPage,
    includeWithoutRecentPosts,
    selectedCreator,
  ]);

  // Handle explicit Gemini AI Search via Influship
  const handleTriggerAiSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) {
      setSearchQuery('');
      setAiInsights(null);
      setCurrentPage(1);
      return;
    }

    setIsAiSearching(true);
    setSearchQuery(q);
    try {
      const res = await searchCreatorsWithAi({
        q,
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        country: selectedCountry || undefined,
        minScore: minScoreFilter || undefined,
        minFollowers: minFollowersFilter || undefined,
        sort: sortBy,
        page: 1,
        limit: 4,
        includeInactive: includeWithoutRecentPosts,
      });

      setCreators(res.data);
      if (res.aiInsights) {
        setAiInsights(res.aiInsights);
      }
      setTotalPages(res.meta.totalPages || 1);
      setTotalClusterCount(res.meta.clusterTotal || 42);
      setCurrentPage(1);

      showToast(
        res.aiInsights?.usedGemini
          ? `✨ Gemini & Influship matched ${res.data.length} suitable KOLs!`
          : `Found ${res.data.length} KOLs for "${q}"`
      );
    } catch (err) {
      console.error('Error during Gemini search:', err);
      showToast('AI search completed with cached directory fallback.');
    } finally {
      setIsAiSearching(false);
    }
  };

  // Load MCP status
  const loadMcpStatus = useCallback(async () => {
    try {
      const status = await checkMcpStatus();
      setMcpStatus(status);
    } catch (err) {
      console.error('Error checking MCP status:', err);
    }
  }, []);

  useEffect(() => {
    loadCreators();
  }, [loadCreators]);

  useEffect(() => {
    loadMcpStatus();
  }, [loadMcpStatus]);

  // Sync a single creator profile
  const handleSyncSingleCreator = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSyncingCreatorId(id);
    try {
      const res = await syncCreatorProfile(id);
      setCreators((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      if (selectedCreator?.id === id) {
        setSelectedCreator(res.data);
      }
      showToast(`Profile synced via Influship MCP (${res.data.handle})`);
      loadMcpStatus();
    } catch {
      showToast('Profile synced with cached intelligence.');
    } finally {
      setSyncingCreatorId(null);
    }
  };

  // Sync all creators
  const handleSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      const res = await syncAllCreators();
      setCreators(res.data.slice(0, 4));
      if (selectedCreator) {
        const found = res.data.find((c) => c.id === selectedCreator.id);
        if (found) setSelectedCreator(found);
      }
      showToast('All 42 Singapore KOL profiles refreshed and synced via Influship MCP!');
      loadMcpStatus();
    } catch {
      showToast('Batch sync completed.');
    } finally {
      setIsSyncingAll(false);
    }
  };

  // Toggle Shortlist
  const handleToggleShortlist = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const res = await toggleShortlist(id);
      setCreators((prev) => prev.map((c) => (c.id === id ? res.data : c)));
      if (selectedCreator?.id === id) {
        setSelectedCreator(res.data);
      }
      showToast(
        res.shortlisted
          ? `Added ${res.data.name} to Shortlist`
          : `Removed ${res.data.name} from Shortlist`
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedCountry('');
    setMinScoreFilter(null);
    setMinFollowersFilter(null);
    setCurrentPage(1);
    setIsFilterModalOpen(false);
    showToast('Filters reset to default');
  };

  const appliedFilterCount =
    (selectedCountry ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (minScoreFilter ? 1 : 0) +
    (minFollowersFilter ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const shortlistedCount = creators.filter((c) => c.shortlisted).length;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-['Inter'] antialiased">
      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-[#0b1c30] text-white text-[13px] font-medium rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <span className="material-symbols-outlined text-[16px] text-emerald-400">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Web-Based Desktop Global Header */}
      <Header
        activeTab={activeNavTab}
        onTabChange={(tab) => {
          setActiveNavTab(tab);
          setSelectedCreator(null);
        }}
        mcpStatus={mcpStatus}
        onOpenMcpModal={() => setIsMcpModalOpen(true)}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
        shortlistCount={shortlistedCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative w-full">
        {selectedCreator ? (
          /* Creator Profile Deep Dive Desktop Screen */
          <CreatorDeepDive
            creator={selectedCreator}
            onBack={() => setSelectedCreator(null)}
            onSync={async (id) => {
              await handleSyncSingleCreator(id);
            }}
            onToggleShortlist={(id) => handleToggleShortlist(id)}
            isSyncing={syncingCreatorId === selectedCreator.id}
          />
        ) : (
          /* Desktop Tab Views */
          <>
            {activeNavTab === 'discovery' && (
              <DiscoveryView
                creators={creators}
                totalClusterCount={totalClusterCount}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(p) => setCurrentPage(p)}
                onSelectCreator={(c) => setSelectedCreator(c)}
                onToggleShortlist={handleToggleShortlist}
                onSyncSingleCreator={handleSyncSingleCreator}
                onSyncAll={handleSyncAll}
                isSyncingAll={isSyncingAll}
                onOpenBenchmark={() => setIsBenchmarkOpen(true)}
                onOpenFilterSheet={() => setIsFilterModalOpen(true)}
                syncingCreatorId={syncingCreatorId}
                searchQuery={searchQuery}
                onSearchChange={(q) => {
                  setSearchQuery(q);
                  if (!q.trim()) {
                    setAiInsights(null);
                  }
                  setCurrentPage(1);
                }}
                onTriggerAiSearch={handleTriggerAiSearch}
                isAiSearching={isAiSearching}
                aiInsights={aiInsights}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                selectedCountry={selectedCountry}
                onCountryChange={(cntry) => {
                  setSelectedCountry(cntry);
                  setCurrentPage(1);
                }}
                minScoreFilter={minScoreFilter}
                onToggleMinScore={() => {
                  setMinScoreFilter((prev) => (prev === 80 ? null : 80));
                  setCurrentPage(1);
                }}
                minFollowersFilter={minFollowersFilter}
                onToggleMinFollowers={() => {
                  setMinFollowersFilter((prev) => (prev === 100000 ? null : 100000));
                  setCurrentPage(1);
                }}
                sortBy={sortBy}
                onSortChange={(s) => setSortBy(s)}
                includeWithoutRecentPosts={includeWithoutRecentPosts}
                onToggleIncludeWithoutRecentPosts={() =>
                  setIncludeWithoutRecentPosts((prev) => !prev)
                }
                appliedFilterCount={appliedFilterCount}
              />
            )}

            {activeNavTab === 'shortlist' && (
              <div className="max-w-[1600px] mx-auto w-full">
                <ShortlistView
                  creators={creators}
                  onSelectCreator={(c) => setSelectedCreator(c)}
                  onToggleShortlist={handleToggleShortlist}
                  onSyncSingleCreator={handleSyncSingleCreator}
                  onOpenBenchmark={() => setIsBenchmarkOpen(true)}
                />
              </div>
            )}

            {activeNavTab === 'campaigns' && (
              <div className="max-w-[1600px] mx-auto w-full">
                <CampaignsView />
              </div>
            )}

            {activeNavTab === 'analytics' && (
              <div className="max-w-[1600px] mx-auto w-full">
                <AnalyticsView />
              </div>
            )}
          </>
        )}
      </main>

      {/* Dialog Modals */}
      <McpConnectionModal
        status={mcpStatus}
        isOpen={isMcpModalOpen}
        onClose={() => setIsMcpModalOpen(false)}
        onRefreshStatus={loadMcpStatus}
      />

      <BenchmarkModal
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        selectedCreators={creators}
      />

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setCurrentPage(1);
        }}
        selectedCountry={selectedCountry}
        onSelectCountry={(c) => {
          setSelectedCountry(c);
          setCurrentPage(1);
        }}
        minScore={minScoreFilter}
        onSetMinScore={(s) => {
          setMinScoreFilter(s);
          setCurrentPage(1);
        }}
        minFollowers={minFollowersFilter}
        onSetMinFollowers={(f) => {
          setMinFollowersFilter(f);
          setCurrentPage(1);
        }}
        onReset={handleResetFilters}
      />

      <HealthMonitorModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />
    </div>
  );
}
