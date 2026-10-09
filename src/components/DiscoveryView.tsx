/**
 * @file src/components/DiscoveryView.tsx
 * Main KOL Discovery screen matching the reference HTML & screenshot
 */

import React, { useState } from 'react';
import { Creator, AiInsights } from '../types';
import { CreatorCard } from './CreatorCard';

interface DiscoveryViewProps {
  creators: Creator[];
  totalClusterCount: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSelectCreator: (creator: Creator) => void;
  onToggleShortlist: (id: string, e: React.MouseEvent) => void;
  onSyncSingleCreator: (id: string, e: React.MouseEvent) => void;
  onSyncAll: () => Promise<void>;
  isSyncingAll?: boolean;
  onOpenBenchmark: () => void;
  onOpenFilterSheet: () => void;
  syncingCreatorId?: string | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onTriggerAiSearch?: (query: string) => void;
  isAiSearching?: boolean;
  aiInsights?: AiInsights | null;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  minScoreFilter: number | null;
  onToggleMinScore: () => void;
  minFollowersFilter: number | null;
  onToggleMinFollowers: () => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  includeWithoutRecentPosts: boolean;
  onToggleIncludeWithoutRecentPosts: () => void;
  appliedFilterCount: number;
  onResetFilters?: () => void;
}

export const DiscoveryView: React.FC<DiscoveryViewProps> = ({
  creators,
  totalClusterCount,
  currentPage,
  totalPages,
  onPageChange,
  onSelectCreator,
  onToggleShortlist,
  onSyncSingleCreator,
  onSyncAll,
  isSyncingAll = false,
  onOpenBenchmark,
  onOpenFilterSheet,
  syncingCreatorId,
  searchQuery,
  onSearchChange,
  onTriggerAiSearch,
  isAiSearching = false,
  aiInsights,
  selectedCategory,
  onCategoryChange,
  selectedCountry,
  onCountryChange,
  minScoreFilter,
  onToggleMinScore,
  minFollowersFilter,
  onToggleMinFollowers,
  sortBy,
  onSortChange,
  includeWithoutRecentPosts,
  onToggleIncludeWithoutRecentPosts,
  appliedFilterCount,
  onResetFilters,
}) => {
  const [exportNotice, setExportNotice] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTriggerAiSearch) {
      onTriggerAiSearch(searchQuery);
    }
  };

  const handleExport = () => {
    // Generate CSV export
    const headers = 'Name,Handle,Platform,Category,Followers,Engagement Rate,Score,Local Audience,AQS\n';
    const rows = creators
      .map(
        (c) =>
          `"${c.name}","${c.handle}","${c.platform}","${c.category}","${c.followersDisplay}","${c.engagementRateDisplay}","${c.score}","${c.localAudiencePct}%","${c.audienceQualityScore}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Cloutify_Singapore_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="flex flex-col w-full max-w-[1600px] mx-auto pb-12">
      {/* Top Intelligence Header & Quick Actions */}
      <div className="px-6 lg:px-8 pt-6 pb-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#3525cd] text-white shadow-xs">
                <span className="material-symbols-outlined text-[19px]">radar</span>
              </span>
              <h1 className="font-bold text-[24px] lg:text-[28px] text-[#0b1c30] tracking-tight font-['Geist']">
                Cloutify Discovery Workspace
              </h1>
            </div>
            <p className="text-[14px] text-[#464555] font-['Inter']">
              Real-time engagement, audience reach &amp; sentiment audit powered by Cloutify &amp; Influship MCP
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Sync All Button */}
            <button
              onClick={onSyncAll}
              disabled={isSyncingAll}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all shadow-xs ${
                isSyncingAll
                  ? 'bg-[#eff4ff] text-[#3525cd] cursor-wait'
                  : 'bg-[#3525cd] text-white hover:bg-[#4f46e5]'
              }`}
              title="Sync all matched creator profiles with Influship MCP"
            >
              <span className={`material-symbols-outlined text-[17px] ${isSyncingAll ? 'animate-spin' : ''}`}>
                sync
              </span>
              <span>{isSyncingAll ? 'Synchronizing Cluster...' : 'Sync All Profiles'}</span>
            </button>

            {/* Compare Button */}
            <button
              onClick={onOpenBenchmark}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] hover:bg-[#eff4ff] text-[#3525cd] text-[13px] font-semibold transition-colors shadow-xs"
              title="Compare audience overlap across 4 KOLs"
            >
              <span className="material-symbols-outlined text-[17px]">compare</span>
              <span>Compare Overlap</span>
            </button>

            {/* Export Report */}
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] hover:bg-[#eff4ff] text-[#0b1c30] text-[13px] font-semibold transition-colors shadow-xs"
              title="Export Intelligence Report CSV"
            >
              <span className="material-symbols-outlined text-[17px] text-[#3525cd]">download</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Export notification toast */}
      {exportNotice && (
        <div className="px-6 lg:px-8 mb-2">
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[13px] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span>
            <span>KOL intelligence dataset exported to CSV successfully!</span>
          </div>
        </div>
      )}

      {/* Search & Natural Language Filter Engine with Gemini AI */}
      <div className="px-6 lg:px-8 mb-3">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex items-center bg-white rounded-xl border border-[#e2e8f0] shadow-xs focus-within:border-[#3525cd] focus-within:ring-2 focus-within:ring-[#3525cd]/15 transition-all"
        >
          <span className="material-symbols-outlined absolute left-3.5 text-[#464555] text-[22px] pointer-events-none">
            {isAiSearching ? 'progress_activity' : 'search'}
          </span>
          <input
            className="w-full pl-11 pr-36 py-3 bg-transparent text-[14px] text-[#0b1c30] placeholder:text-[#777587] focus:outline-none font-['Inter']"
            placeholder="Search or ask Gemini to discover KOLs across all niches (e.g. 'Tech reviewers', 'Foodies', 'Dating creators')..."
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <div className="absolute right-2.5 flex items-center gap-1.5">
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  if (onTriggerAiSearch) onTriggerAiSearch('');
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#464555] hover:bg-[#eff4ff] transition-colors"
                title="Clear Search"
              >
                <span className="material-symbols-outlined text-[18px]">cancel</span>
              </button>
            )}

            {/* Ask Gemini Search Button */}
            <button
              type="submit"
              disabled={isAiSearching}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-white text-[12px] font-semibold transition-all shadow-xs ${
                isAiSearching
                  ? 'bg-[#4f46e5] opacity-75 cursor-wait'
                  : 'bg-gradient-to-r from-[#3525cd] to-[#4f46e5] hover:opacity-90 active:scale-95'
              }`}
              title="Query suitable KOLs with Gemini & Influship"
            >
              <span className={`material-symbols-outlined text-[15px] ${isAiSearching ? 'animate-spin' : ''}`}>
                {isAiSearching ? 'sync' : 'auto_awesome'}
              </span>
              <span>{isAiSearching ? 'Querying...' : 'Gemini'}</span>
            </button>

            {/* Filters Sheet Trigger */}
            <button
              type="button"
              onClick={onOpenFilterSheet}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#eff4ff] text-[#3525cd] hover:bg-[#dce9ff] transition-colors text-[12px] font-semibold"
              title="Advanced Filter Sheet"
            >
              <span className="material-symbols-outlined text-[16px]">tune</span>
              <span>Filters</span>
            </button>
          </div>
        </form>

        {/* Quick Query Suggestions for Inspiration */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 text-nowrap">
          <span className="text-[11px] text-[#777587] font-medium flex items-center gap-1 shrink-0">
            <span className="material-symbols-outlined text-[13px] text-[#3525cd]">tips_and_updates</span>
            Try asking:
          </span>
          {[
            { label: 'All Top Creators', query: '' },
            { label: '🇸🇬 Singapore KOLs', query: 'Verified creators in Singapore' },
            { label: '❤️ Dating & Relationships', query: 'Dating and relationship podcast hosts' },
            { label: '💻 Tech & AI Gadgets', query: 'Tech gadget reviewers and electronics' },
            { label: '🍲 Food & Cafe Guides', query: 'Food lovers and cafe hunters' },
            { label: '👗 Fashion & Luxury GRWM', query: 'Fashion styling and luxury' },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                onSearchChange(item.query);
                if (onTriggerAiSearch) onTriggerAiSearch(item.query);
              }}
              className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white hover:bg-[#eff4ff] text-[#464555] hover:text-[#3525cd] border border-[#e2e8f0] transition-colors shadow-2xs"
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* AI Searching State Animation */}
      {isAiSearching && (
        <div className="mx-6 lg:mx-8 mb-3 p-3 bg-gradient-to-r from-[#eff4ff] via-[#e0e7ff] to-[#f5f3ff] rounded-xl border border-[#c3c0ff] shadow-xs flex items-center gap-3 animate-pulse">
          <span className="w-7 h-7 rounded-lg bg-[#3525cd] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[18px] animate-spin">auto_awesome</span>
          </span>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#0b1c30] font-['Geist'] flex items-center gap-1.5">
              <span>Querying Suitable KOLs with Gemini &amp; Influship MCP...</span>
            </span>
            <span className="text-[11px] text-[#464555]">
              Evaluating audience reach, sentiment quality, local Singapore concentration, and campaign fit.
            </span>
          </div>
        </div>
      )}

      {/* Gemini + Influship AI Intelligence Banner */}
      {!isAiSearching && aiInsights && (
        <div className="mx-6 lg:mx-8 mb-3 p-3.5 bg-gradient-to-r from-[#eff4ff] to-[#f5f3ff] rounded-xl border border-[#c3c0ff] shadow-xs animate-in fade-in">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-[#3525cd] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <span className="material-symbols-outlined text-[15px]">auto_awesome</span>
              </span>
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-[13px] text-[#0b1c30] font-['Geist']">
                    Gemini x Influship AI Evaluation
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#3525cd] text-white px-2 py-0.2 rounded-full">
                    {aiInsights.matchedCount} KOLs Matched
                  </span>
                  {aiInsights.keyMatchedNiche && (
                    <span className="text-[11px] font-medium text-[#464555] bg-white px-2 py-0.2 rounded-md border border-[#e2e8f0]">
                      Niche: {aiInsights.keyMatchedNiche}
                    </span>
                  )}
                  {aiInsights.modelUsed && (
                    <span className="text-[10px] font-mono text-[#006591] bg-[#dce9ff] px-1.5 py-0.2 rounded">
                      {aiInsights.modelUsed}
                    </span>
                  )}
                </div>
                <p className="text-[12px] text-[#464555] leading-relaxed font-['Inter']">
                  {aiInsights.summary}
                </p>

                {/* Suggested Refinement Pills */}
                {aiInsights.suggestedRefinements && aiInsights.suggestedRefinements.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[11px] text-[#464555] font-semibold">Suggested Refinements:</span>
                    {aiInsights.suggestedRefinements.map((refinement) => (
                      <button
                        key={refinement}
                        type="button"
                        onClick={() => {
                          onSearchChange(refinement);
                          if (onTriggerAiSearch) onTriggerAiSearch(refinement);
                        }}
                        className="text-[11px] font-medium text-[#3525cd] bg-white hover:bg-[#eff4ff] px-2.5 py-0.5 rounded-full border border-[#c3c0ff] transition-colors"
                      >
                        {refinement}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <span className="text-[10px] font-mono text-[#464555] shrink-0 bg-white px-2 py-1 rounded border border-[#e2e8f0]">
              Gemini AI • Influship MCP
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Filter Pill Carousel with Quick Toggles */}
      <div className="flex items-center gap-2 px-6 lg:px-8 overflow-x-auto no-scrollbar pb-1 mb-3 text-nowrap">
        {/* Quick Toggle: Singapore */}
        <button
          type="button"
          onClick={() => onCountryChange(selectedCountry === 'Singapore' ? '' : 'Singapore')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Geist'] transition-all shadow-xs border ${
            selectedCountry === 'Singapore'
              ? 'bg-[#3525cd] text-white border-[#3525cd]'
              : 'bg-white text-[#0b1c30] border-[#e2e8f0] hover:bg-[#eff4ff]'
          }`}
          title={selectedCountry === 'Singapore' ? 'Remove Singapore filter' : 'Filter by Singapore'}
        >
          <span>🇸🇬</span>
          <span>Singapore</span>
          {selectedCountry === 'Singapore' && (
            <span className="material-symbols-outlined text-[14px]">check</span>
          )}
        </button>

        {/* Quick Toggle: Dating & Relationships */}
        <button
          type="button"
          onClick={() =>
            onCategoryChange(selectedCategory === 'Dating & Relationships' ? '' : 'Dating & Relationships')
          }
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Geist'] transition-all shadow-xs border ${
            selectedCategory === 'Dating & Relationships'
              ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
              : 'bg-white text-[#0b1c30] border-[#e2e8f0] hover:bg-[#eff4ff]'
          }`}
          title={
            selectedCategory === 'Dating & Relationships'
              ? 'Remove Dating & Relationships filter'
              : 'Filter by Dating & Relationships'
          }
        >
          <span
            className={`material-symbols-outlined text-[15px] ${
              selectedCategory === 'Dating & Relationships' ? 'text-white' : 'text-[#ba1a1a]'
            }`}
          >
            favorite
          </span>
          <span>Dating &amp; Relationships</span>
          {selectedCategory === 'Dating & Relationships' && (
            <span className="material-symbols-outlined text-[14px]">check</span>
          )}
        </button>

        {/* Quick Toggle: Tech & Gadgets */}
        <button
          type="button"
          onClick={() => onCategoryChange(selectedCategory === 'Tech & Gadgets' ? '' : 'Tech & Gadgets')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Geist'] transition-all shadow-xs border ${
            selectedCategory === 'Tech & Gadgets'
              ? 'bg-[#006591] text-white border-[#006591]'
              : 'bg-white text-[#0b1c30] border-[#e2e8f0] hover:bg-[#eff4ff]'
          }`}
          title={
            selectedCategory === 'Tech & Gadgets'
              ? 'Remove Tech & Gadgets filter'
              : 'Filter by Tech & Gadgets'
          }
        >
          <span
            className={`material-symbols-outlined text-[15px] ${
              selectedCategory === 'Tech & Gadgets' ? 'text-white' : 'text-[#006591]'
            }`}
          >
            devices
          </span>
          <span>Tech &amp; Gadgets</span>
          {selectedCategory === 'Tech & Gadgets' && (
            <span className="material-symbols-outlined text-[14px]">check</span>
          )}
        </button>

        {/* Quick Toggle: Food & Dining */}
        <button
          type="button"
          onClick={() => onCategoryChange(selectedCategory === 'Food & Dining' ? '' : 'Food & Dining')}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Geist'] transition-all shadow-xs border ${
            selectedCategory === 'Food & Dining'
              ? 'bg-[#b95000] text-white border-[#b95000]'
              : 'bg-white text-[#0b1c30] border-[#e2e8f0] hover:bg-[#eff4ff]'
          }`}
          title={
            selectedCategory === 'Food & Dining'
              ? 'Remove Food & Dining filter'
              : 'Filter by Food & Dining'
          }
        >
          <span
            className={`material-symbols-outlined text-[15px] ${
              selectedCategory === 'Food & Dining' ? 'text-white' : 'text-[#b95000]'
            }`}
          >
            restaurant
          </span>
          <span>Food &amp; Dining</span>
          {selectedCategory === 'Food & Dining' && (
            <span className="material-symbols-outlined text-[14px]">check</span>
          )}
        </button>

        {/* Other Active Category (if selected from modal) */}
        {selectedCategory &&
          !['Dating & Relationships', 'Tech & Gadgets', 'Food & Dining'].includes(selectedCategory) && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c9e6ff] text-[#001e2f] shadow-xs border border-[#89ceff]">
              <span className="text-[12px] font-semibold font-['Geist']">{selectedCategory}</span>
              <button
                onClick={() => onCategoryChange('')}
                aria-label="Remove category filter"
                className="hover:opacity-75 flex items-center"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>
          )}

        {/* Other Active Country (if selected from modal) */}
        {selectedCountry && selectedCountry !== 'Singapore' && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#c9e6ff] text-[#001e2f] shadow-xs border border-[#89ceff]">
            <span className="text-[12px] font-semibold font-['Geist']">{selectedCountry}</span>
            <button
              onClick={() => onCountryChange('')}
              aria-label="Remove country filter"
              className="hover:opacity-75 flex items-center"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        {/* Quick Pill: Score > 80 */}
        <button
          onClick={onToggleMinScore}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Geist'] transition-colors shadow-xs border ${
            minScoreFilter === 80
              ? 'bg-[#3525cd] text-white border-[#3525cd]'
              : 'bg-white text-[#0b1c30] border-[#e2e8f0] hover:bg-[#eff4ff]'
          }`}
        >
          <span>Score &gt; 80</span>
          <span
            className={`material-symbols-outlined text-[15px] ${
              minScoreFilter === 80 ? 'text-white' : 'text-[#005338]'
            }`}
          >
            check_circle
          </span>
        </button>

        {/* Quick Pill: Followers: 100k+ */}
        <button
          onClick={onToggleMinFollowers}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[12px] font-semibold font-['Geist'] transition-colors shadow-xs border ${
            minFollowersFilter === 100000
              ? 'bg-[#3525cd] text-white border-[#3525cd]'
              : 'bg-white text-[#0b1c30] border-[#e2e8f0] hover:bg-[#eff4ff]'
          }`}
        >
          <span>Followers: 100k+</span>
        </button>

        {/* Clear All Filters button (visible when any filter is active) */}
        {appliedFilterCount > 0 && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition-colors shadow-xs text-[12px] font-semibold font-['Geist']"
            title="Clear all active filters"
          >
            <span className="material-symbols-outlined text-[15px]">filter_alt_off</span>
            <span>Clear Filters ({appliedFilterCount})</span>
          </button>
        )}

        {/* More Filters with Count Badge */}
        <button
          onClick={onOpenFilterSheet}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#e5eeff] text-[#464555] hover:text-[#0b1c30] transition-colors shadow-xs border border-[#dce9ff]"
        >
          <span className="text-[12px] font-semibold font-['Geist']">All Filters</span>
          <span className="w-4 h-4 rounded-full bg-[#3525cd] text-white text-[10px] flex items-center justify-center font-bold leading-none">
            {appliedFilterCount}
          </span>
        </button>
      </div>

      {/* Data Stream Reference Pill / Meta Bar */}
      <div className="mx-6 lg:mx-8 mb-4 p-3.5 bg-[#eff4ff] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#dce9ff] shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#005338] animate-pulse" />
          <span className="text-[13px] text-[#0b1c30] font-bold font-['Geist']">
            {totalClusterCount} Matched Creators
          </span>
          <span className="text-[13px] text-[#464555]">
            {selectedCountry ? `in ${selectedCountry}` : 'across all profiles'}
            {selectedCategory ? ` • ${selectedCategory}` : ''}
          </span>
        </div>

        <div className="flex items-center gap-4">
          {/* Toggle row: Include KOLs without recent posts */}
          <div className="flex items-center gap-2 text-[#464555]">
            <span className="material-symbols-outlined text-[16px]">history_toggle_off</span>
            <span className="text-[12px]">Include KOLs without recent posts</span>
            <label className="relative inline-flex items-center cursor-pointer ml-1">
              <input
                checked={includeWithoutRecentPosts}
                onChange={onToggleIncludeWithoutRecentPosts}
                type="checkbox"
                className="sr-only peer"
              />
              <div className="w-8 h-4 bg-[#d3e4fe] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[2px] after:bg-white after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-[#3525cd]" />
            </label>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 rounded-lg bg-white border border-[#e2e8f0] text-[#0b1c30] text-[12px] font-semibold font-['Geist'] shadow-xs focus:outline-none cursor-pointer"
            >
              <option value="score">Sort: Score Rank</option>
              <option value="followers">Sort: Followers</option>
              <option value="engagement">Sort: Eng. Rate</option>
              <option value="growth">Sort: Growth MoM</option>
            </select>
            <span className="material-symbols-outlined text-[18px] text-[#464555] absolute right-2 top-1.5 pointer-events-none">
              arrow_drop_down
            </span>
          </div>
        </div>
      </div>

      {/* Creator Cards Desktop Grid (2-column high density layout) */}
      <div className="px-6 lg:px-8">
        {creators.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#e2e8f0]">
            <span className="material-symbols-outlined text-[48px] text-[#464555] mb-2">
              search_off
            </span>
            <h3 className="font-bold text-[18px] text-[#0b1c30] mb-1">No KOLs matched your filter</h3>
            <p className="text-[14px] text-[#464555] mb-4">
              Try adjusting your search keywords, score thresholds, or category tags.
            </p>
            <button
              onClick={() => {
                if (onResetFilters) {
                  onResetFilters();
                } else {
                  onSearchChange('');
                  onCategoryChange('');
                  onCountryChange('');
                }
              }}
              className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-[13px] font-semibold hover:bg-[#4f46e5] transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {creators.map((creator) => (
              <CreatorCard
                key={creator.id}
                creator={creator}
                onAuditProfile={onSelectCreator}
                onToggleShortlist={onToggleShortlist}
                onSyncProfile={onSyncSingleCreator}
                isSyncing={syncingCreatorId === creator.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination & Navigation Controls */}
      <div className="px-6 lg:px-8 mt-6 flex items-center justify-between">
        <span className="text-[13px] text-[#464555] font-['Geist']">
          Showing {creators.length > 0 ? 1 : 0} to {creators.length} of {totalClusterCount} KOLs
          {selectedCountry ? ` in ${selectedCountry}` : ' in Directory'}
        </span>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              currentPage <= 1
                ? 'bg-[#e5eeff] text-[#777587] cursor-not-allowed opacity-60'
                : 'bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>

          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-9 h-9 rounded-xl text-[13px] font-bold font-['Geist'] flex items-center justify-center transition-colors shadow-xs ${
                currentPage === page
                  ? 'bg-[#3525cd] text-white'
                  : 'bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
              currentPage >= totalPages
                ? 'bg-[#e5eeff] text-[#777587] cursor-not-allowed opacity-60'
                : 'bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Benchmarking Callout Card */}
      <div className="mx-6 lg:mx-8 mt-6 p-4 bg-white rounded-2xl border border-[#e2e8f0] shadow-xs flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#e2dfff] flex items-center justify-center text-[#3525cd] shrink-0">
            <span className="material-symbols-outlined text-[24px]">analytics</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[15px] text-[#0b1c30] leading-tight font-['Geist']">
              Sync Custom Tracker
            </span>
            <span className="text-[13px] text-[#464555] font-['Inter']">
              Compare live audience overlap and deduplicated reach across selected 4 KOLs
            </span>
          </div>
        </div>

        <button
          onClick={onOpenBenchmark}
          className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-[13px] font-semibold shrink-0 shadow-xs hover:bg-[#4f46e5] transition-colors font-['Geist'] cursor-pointer flex items-center gap-1.5"
        >
          <span>Compare Overlap</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};
