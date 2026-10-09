/**
 * @file src/components/CreatorDeepDive.tsx
 * Creator Profile Deep Dive screen for Mobile and Desktop
 * Includes bio sections, recent project portfolios, audience demographics, and sync button
 */

import React, { useState } from 'react';
import { Creator } from '../types';

interface CreatorDeepDiveProps {
  creator: Creator;
  onBack: () => void;
  onSync: (id: string) => Promise<void>;
  onToggleShortlist: (id: string) => void;
  isSyncing?: boolean;
}

export const CreatorDeepDive: React.FC<CreatorDeepDiveProps> = ({
  creator,
  onBack,
  onSync,
  onToggleShortlist,
  isSyncing = false,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolios' | 'demographics' | 'content' | 'mcp'>(
    'overview'
  );
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleSyncClick = async () => {
    try {
      await onSync(creator.id);
      setSyncFeedback('Profile metrics successfully refreshed from Influship MCP!');
      setTimeout(() => setSyncFeedback(null), 4000);
    } catch {
      setSyncFeedback('Profile synced with cached intelligence.');
      setTimeout(() => setSyncFeedback(null), 4000);
    }
  };

  const getPlatformIcon = (platform: Creator['platform']) => {
    switch (platform) {
      case 'instagram':
        return { icon: 'photo_camera', name: 'Instagram', bg: 'bg-[#3525cd] text-white' };
      case 'tiktok':
        return { icon: 'movie', name: 'TikTok', bg: 'bg-[#39b8fd] text-[#004666]' };
      case 'youtube':
        return { icon: 'smart_display', name: 'YouTube', bg: 'bg-[#ba1a1a] text-white' };
      default:
        return { icon: 'public', name: 'Social', bg: 'bg-[#464555] text-white' };
    }
  };

  const platformInfo = getPlatformIcon(creator.platform);

  return (
    <div className="flex-1 w-full bg-[#f8f9ff] pb-24">
      {/* Top Header Sticky Navigation */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0] px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold transition-colors shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Back to Discovery</span>
          </button>
          <span className="text-[#c7c4d8]">|</span>
          <div className="flex items-center gap-2">
            <span className="font-bold text-[15px] text-[#0b1c30]">
              {creator.name}
            </span>
            <span className="text-[12px] font-mono text-[#464555]">
              {creator.handle}
            </span>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2.5">
          {/* Sync Button */}
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold transition-all shadow-xs ${
              isSyncing
                ? 'bg-[#e5eeff] text-[#3525cd] cursor-wait'
                : 'bg-[#3525cd] text-white hover:bg-[#4f46e5]'
            }`}
            title="Sync live creator metrics from Influship MCP"
          >
            <span className={`material-symbols-outlined text-[17px] ${isSyncing ? 'animate-spin' : ''}`}>
              sync
            </span>
            <span>{isSyncing ? 'Synchronizing...' : 'Sync Profile'}</span>
          </button>

          {/* Shortlist Toggle */}
          <button
            onClick={() => onToggleShortlist(creator.id)}
            className={`px-3 py-2 rounded-xl border text-[13px] font-semibold flex items-center gap-1.5 transition-colors shadow-xs ${
              creator.shortlisted
                ? 'bg-[#e2dfff] text-[#3323cc] border-[#c3c0ff]'
                : 'bg-white text-[#464555] border-[#e2e8f0] hover:text-[#3525cd]'
            }`}
            title={creator.shortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{ fontVariationSettings: creator.shortlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
            <span>{creator.shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </button>

          {/* Export Dossier */}
          <button
            onClick={() => {
              alert(`Exporting Deep Dive Dossier PDF for ${creator.name} (${creator.handle})...`);
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#e2e8f0] text-[#0b1c30] hover:bg-[#eff4ff] text-[13px] font-semibold transition-colors shadow-xs"
            title="Download Intelligence Dossier"
          >
            <span className="material-symbols-outlined text-[17px] text-[#3525cd]">download</span>
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Sync toast notification */}
      {syncFeedback && (
        <div className="max-w-[1600px] mx-auto px-6 lg:px-8 pt-4">
          <div className="flex items-center gap-2 p-3 bg-[#e2dfff] border border-[#c3c0ff] text-[#0f0069] rounded-xl text-[13px] font-medium shadow-xs animate-in fade-in">
            <span className="material-symbols-outlined text-[#3525cd] text-[18px]">verified</span>
            <span>{syncFeedback}</span>
            <span className="text-[11px] font-mono ml-auto opacity-75">
              Synced: {new Date(creator.lastSyncedAt).toLocaleTimeString()}
            </span>
          </div>
        </div>
      )}

      {/* Main Content Container: Desktop 12-column grid */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column / Mobile Top: Profile Identity & Bio Card */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            {/* Creator Identity Hero Card */}
            <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs overflow-hidden">
              {/* Cover Banner */}
              <div className="h-32 w-full relative overflow-hidden bg-gradient-to-r from-[#3525cd] to-[#006591]">
                <img
                  src={creator.coverImage}
                  alt={creator.name}
                  className="w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-[#0b1c30] font-mono shadow-xs">
                  Score {creator.score}/100
                </div>
              </div>

              {/* Avatar & Identification Info */}
              <div className="p-5 pt-0 relative">
                <div className="flex items-end justify-between -mt-12 mb-3">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg flex items-center justify-center shadow-xs ${platformInfo.bg}`}
                    >
                      <span className="material-symbols-outlined text-[13px]">{platformInfo.icon}</span>
                    </span>
                  </div>

                  {/* Algorithmic Confidence pill */}
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1 bg-[#eff4ff] px-2.5 py-1 rounded-lg border border-[#dce9ff]">
                      <span className="text-[13px] font-bold text-[#0b1c30] font-['Geist']">
                        {creator.score}
                      </span>
                      <span className="text-[11px] text-[#464555] font-['Geist']">/100</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-[#464555] font-mono">
                      <span>Conf: {creator.scoreBreakdown.algorithmConfidence}</span>
                    </div>
                  </div>
                </div>

                {/* Name, Verified, Handle, Badge */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-[20px] font-bold text-[#0b1c30] tracking-tight font-['Geist']">
                    {creator.name}
                  </h1>
                  {creator.verified && (
                    <span
                      className="material-symbols-outlined text-[#006591] text-[18px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                      title="Verified Identity"
                    >
                      verified
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-[#6ffbbe] text-[#002113] font-['Geist']">
                    {creator.tag}
                  </span>
                </div>

                <p className="text-[13px] text-[#464555] font-mono mb-3">{creator.handle}</p>

                {/* Location & Categories */}
                <div className="flex items-center gap-2 flex-wrap mb-4 text-[12px]">
                  <span className="inline-flex items-center gap-1 text-[#464555] bg-[#eff4ff] px-2 py-0.5 rounded-md">
                    <span>🇸🇬</span>
                    <span>{creator.location}</span>
                  </span>
                  <span className="text-[#3525cd] bg-[#e2dfff] px-2 py-0.5 rounded-md font-medium">
                    {creator.category}
                  </span>
                  <span className="text-[#005338] bg-[#6ffbbe]/30 px-2 py-0.5 rounded-md font-medium">
                    Local {creator.localAudiencePct}%
                  </span>
                </div>

                {/* Primary Bio Section */}
                <div className="border-t border-[#f1f5f9] pt-3.5 mb-4">
                  <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#464555] font-['Geist'] mb-1.5">
                    Bio & Focus
                  </h3>
                  <p className="text-[13px] text-[#0b1c30] leading-relaxed font-['Inter']">
                    {creator.bio}
                  </p>
                </div>

                {/* In-depth Editorial Background */}
                <div className="border-t border-[#f1f5f9] pt-3.5 mb-4">
                  <h3 className="text-[12px] font-bold uppercase tracking-wider text-[#464555] font-['Geist'] mb-1.5">
                    Editorial Narrative
                  </h3>
                  <p className="text-[12px] text-[#464555] leading-relaxed font-['Inter']">
                    {creator.detailedBio}
                  </p>
                </div>

                {/* Key Booking & Representation Attributes */}
                <div className="border-t border-[#f1f5f9] pt-3.5 space-y-2 text-[12px]">
                  <div className="flex justify-between items-center">
                    <span className="text-[#464555]">Agency:</span>
                    <span className="font-semibold text-[#0b1c30]">{creator.agency}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#464555]">Commercial Rate:</span>
                    <span className="font-semibold text-[#3525cd] font-mono">{creator.pricingRange}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#464555]">Audience Quality (AQS):</span>
                    <span className="font-semibold text-[#005338] font-mono">
                      {creator.audienceQualityScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#464555]">Authenticity Index:</span>
                    <span className="font-semibold text-[#0b1c30] font-mono">
                      {creator.authenticityScore}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#464555]">Inquiries:</span>
                    <a
                      href={`mailto:${creator.email}`}
                      className="font-medium text-[#3525cd] hover:underline truncate max-w-[180px]"
                    >
                      {creator.email}
                    </a>
                  </div>
                </div>

                {/* Last Synced Meta Bar */}
                <div className="mt-4 pt-3 border-t border-[#f1f5f9] flex items-center justify-between text-[11px] text-[#464555]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-emerald-600">
                      cloud_done
                    </span>
                    <span>Influship MCP Synced</span>
                  </span>
                  <span className="font-mono">
                    {new Date(creator.lastSyncedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Intelligence Summary Pill */}
            <div className="bg-[#eff4ff] rounded-xl p-4 border border-[#c3c0ff]/60">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[18px] text-[#3525cd]">
                  psychology
                </span>
                <span className="font-bold text-[13px] text-[#0b1c30] font-['Geist']">
                  Influship Match Decision
                </span>
              </div>
              <p className="text-[12px] font-semibold text-[#005338] mb-1">
                {creator.mcpAudit.decision}
              </p>
              <p className="text-[12px] text-[#464555] leading-relaxed">
                {creator.mcpAudit.matchReason}
              </p>
            </div>
          </div>

          {/* Right Column / Mobile Lower: Tabs & Deep Dive Sections */}
          <div className="lg:col-span-8 flex flex-col gap-5">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-[#e2e8f0] pb-2">
              {[
                { id: 'overview', label: 'Overview & KPIs', icon: 'query_stats' },
                { id: 'portfolios', label: `Project Portfolios (${creator.recentProjects.length})`, icon: 'work' },
                { id: 'demographics', label: 'Audience Demographics', icon: 'pie_chart' },
                { id: 'content', label: `Recent Content (${creator.recentPosts.length})`, icon: 'video_library' },
                { id: 'mcp', label: 'MCP Audit & Reasons', icon: 'model_training' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all font-['Geist'] ${
                    activeTab === tab.id
                      ? 'bg-[#3525cd] text-white shadow-xs'
                      : 'bg-white text-[#464555] hover:bg-[#eff4ff] hover:text-[#0b1c30] border border-[#e2e8f0]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* TAB 1: OVERVIEW & CORE METRICS */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-5">
                {/* 6-Card Metric Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                  <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <span className="text-[11px] font-semibold uppercase text-[#464555] tracking-wider font-['Geist']">
                      Followers
                    </span>
                    <div className="text-[22px] font-bold text-[#0b1c30] font-['Geist'] mt-1">
                      {creator.followersDisplay}
                    </div>
                    <span className="text-[11px] text-[#005338] font-medium flex items-center gap-0.5 mt-0.5">
                      <span className="material-symbols-outlined text-[13px]">trending_up</span>
                      <span>Verified Growth</span>
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <span className="text-[11px] font-semibold uppercase text-[#464555] tracking-wider font-['Geist']">
                      Eng. Rate
                    </span>
                    <div className="text-[22px] font-bold text-[#005338] font-['Geist'] mt-1">
                      {creator.engagementRateDisplay}
                    </div>
                    <span className="text-[11px] text-[#464555] mt-0.5">
                      Industry avg: 2.8%
                    </span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <span className="text-[11px] font-semibold uppercase text-[#464555] tracking-wider font-['Geist']">
                      Avg Impressions
                    </span>
                    <div className="text-[22px] font-bold text-[#0b1c30] font-['Geist'] mt-1">
                      {creator.avgImpressionsDisplay}
                    </div>
                    <span className="text-[11px] text-[#464555] mt-0.5">per organic post</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <span className="text-[11px] font-semibold uppercase text-[#464555] tracking-wider font-['Geist']">
                      Avg Engagements
                    </span>
                    <div className="text-[22px] font-bold text-[#0b1c30] font-['Geist'] mt-1">
                      {creator.avgEngagementDisplay}
                    </div>
                    <span className="text-[11px] text-[#464555] mt-0.5">likes & comments</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <span className="text-[11px] font-semibold uppercase text-[#464555] tracking-wider font-['Geist']">
                      SG Audience %
                    </span>
                    <div className="text-[22px] font-bold text-[#3525cd] font-['Geist'] mt-1">
                      {creator.localAudiencePct}%
                    </div>
                    <span className="text-[11px] text-[#464555] mt-0.5">Singapore resident</span>
                  </div>

                  <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
                    <span className="text-[11px] font-semibold uppercase text-[#464555] tracking-wider font-['Geist']">
                      Projected CPM
                    </span>
                    <div className="text-[22px] font-bold text-[#0b1c30] font-['Geist'] mt-1">
                      ${Math.floor(creator.followers / 12000 + 14)}
                    </div>
                    <span className="text-[11px] text-[#005338] mt-0.5">Cost effective</span>
                  </div>
                </div>

                {/* Score Breakdown Radar / Segment Matrix */}
                <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-[15px] text-[#0b1c30] font-['Geist'] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#3525cd]">
                        speed
                      </span>
                      <span>Algorithmic Score Distribution</span>
                    </h3>
                    <span className="text-[12px] font-mono font-semibold text-[#005338] bg-[#6ffbbe]/25 px-2.5 py-0.5 rounded-full">
                      Confidence {creator.scoreBreakdown.algorithmConfidence}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[12px] font-semibold mb-1">
                        <span className="text-[#0b1c30]">Audience Reach Velocity</span>
                        <span className="font-mono text-[#ba1a1a]">{creator.scoreBreakdown.reach}%</span>
                      </div>
                      <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#ba1a1a] h-full rounded-full transition-all duration-500"
                          style={{ width: `${creator.scoreBreakdown.reach}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] font-semibold mb-1">
                        <span className="text-[#0b1c30]">Audience Sentiment & Engagement Quality</span>
                        <span className="font-mono text-[#006591]">{creator.scoreBreakdown.sentiment}%</span>
                      </div>
                      <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#39b8fd] h-full rounded-full transition-all duration-500"
                          style={{ width: `${creator.scoreBreakdown.sentiment}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[12px] font-semibold mb-1">
                        <span className="text-[#0b1c30]">Commercial Conversion & Click-through Potential</span>
                        <span className="font-mono text-[#006e4b]">{creator.scoreBreakdown.conversion}%</span>
                      </div>
                      <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#006e4b] h-full rounded-full transition-all duration-500"
                          style={{ width: `${creator.scoreBreakdown.conversion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Highlighted Recent Project Preview */}
                <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[15px] text-[#0b1c30] font-['Geist'] flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#3525cd]">
                        stars
                      </span>
                      <span>Featured Campaign Collaboration</span>
                    </h3>
                    <button
                      onClick={() => setActiveTab('portfolios')}
                      className="text-[12px] font-semibold text-[#3525cd] hover:underline"
                    >
                      View All Portfolios &rarr;
                    </button>
                  </div>

                  {creator.recentProjects[0] && (
                    <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
                      <img
                        src={creator.recentProjects[0].thumbnail}
                        alt={creator.recentProjects[0].title}
                        className="w-full sm:w-40 h-28 object-cover rounded-lg shadow-xs"
                      />
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-[14px] text-[#0b1c30]">
                              {creator.recentProjects[0].brand}
                            </span>
                            <span className="text-[11px] text-[#464555] bg-white px-2 py-0.5 rounded-md font-mono">
                              {creator.recentProjects[0].date}
                            </span>
                          </div>
                          <h4 className="text-[13px] font-semibold text-[#3525cd] mb-1">
                            {creator.recentProjects[0].title}
                          </h4>
                          <p className="text-[12px] text-[#464555] line-clamp-2">
                            {creator.recentProjects[0].summary}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-[12px] font-mono">
                          <span>
                            Impr: <strong>{creator.recentProjects[0].impressions}</strong>
                          </span>
                          <span>
                            Reach: <strong>{creator.recentProjects[0].reach}</strong>
                          </span>
                          <span className="text-[#005338]">
                            Eng: <strong>{creator.recentProjects[0].engagementRate}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: RECENT PROJECT PORTFOLIOS */}
            {activeTab === 'portfolios' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[16px] text-[#0b1c30] font-['Geist']">
                    Brand Collaborations & Sponsored Campaigns
                  </h3>
                  <span className="text-[12px] text-[#464555] font-mono">
                    {creator.recentProjects.length} Verified Case Studies
                  </span>
                </div>

                <div className="space-y-4">
                  {creator.recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-2xl border border-[#e2e8f0] shadow-xs p-5 hover:border-[#c3c0ff] transition-all"
                    >
                      <div className="flex flex-col md:flex-row gap-5">
                        {/* Media Preview */}
                        <div className="relative shrink-0 md:w-56 h-40 rounded-xl overflow-hidden shadow-xs bg-[#eff4ff]">
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white font-mono">
                            ROI {project.roiScore}/100
                          </div>
                        </div>

                        {/* Portfolio Details */}
                        <div className="flex flex-col justify-between flex-1">
                          <div>
                            {/* Brand Header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={project.brandLogo}
                                  alt={project.brand}
                                  className="w-7 h-7 rounded-full object-cover border border-[#e2e8f0]"
                                />
                                <div>
                                  <h4 className="font-bold text-[15px] text-[#0b1c30] leading-tight">
                                    {project.brand}
                                  </h4>
                                  <span className="text-[11px] text-[#464555] font-mono">
                                    {project.campaignType} • {project.date}
                                  </span>
                                </div>
                              </div>

                              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#eff4ff] text-[#3525cd] font-mono">
                                Eng. Rate {project.engagementRate}
                              </span>
                            </div>

                            {/* Campaign Title & Brief */}
                            <h5 className="font-semibold text-[14px] text-[#3525cd] mb-1.5 font-['Geist']">
                              {project.title}
                            </h5>
                            <p className="text-[13px] text-[#464555] leading-relaxed mb-3 font-['Inter']">
                              {project.summary}
                            </p>
                          </div>

                          {/* Metric Ribbon */}
                          <div className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-[#eff4ff] text-center border border-[#dce9ff]">
                            <div>
                              <span className="text-[10px] text-[#464555] block font-['Geist'] uppercase">
                                Impressions
                              </span>
                              <span className="font-bold text-[13px] text-[#0b1c30] font-mono">
                                {project.impressions}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#464555] block font-['Geist'] uppercase">
                                Unique Reach
                              </span>
                              <span className="font-bold text-[13px] text-[#0b1c30] font-mono">
                                {project.reach}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#464555] block font-['Geist'] uppercase">
                                Saves
                              </span>
                              <span className="font-bold text-[13px] text-[#005338] font-mono">
                                {project.saves.toLocaleString()}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#464555] block font-['Geist'] uppercase">
                                Shares
                              </span>
                              <span className="font-bold text-[13px] text-[#0b1c30] font-mono">
                                {project.shares.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: AUDIENCE DEMOGRAPHICS */}
            {activeTab === 'demographics' && (
              <div className="flex flex-col gap-5">
                {/* Age & Gender Distribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Age Distribution */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <h4 className="font-bold text-[14px] text-[#0b1c30] font-['Geist'] mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-[#3525cd]">
                        bar_chart
                      </span>
                      <span>Age Group Distribution</span>
                    </h4>
                    <div className="space-y-3">
                      {creator.demographics.ageGroups.map((group) => (
                        <div key={group.label}>
                          <div className="flex justify-between text-[12px] font-semibold mb-1">
                            <span className="text-[#464555]">{group.label} years</span>
                            <span className="font-mono text-[#0b1c30]">{group.pct}%</span>
                          </div>
                          <div className="w-full bg-[#f1f5f9] h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-[#3525cd] h-full rounded-full transition-all"
                              style={{ width: `${group.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gender Split */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs flex flex-col justify-between">
                    <h4 className="font-bold text-[14px] text-[#0b1c30] font-['Geist'] mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-[#006591]">
                        wc
                      </span>
                      <span>Audience Gender Split</span>
                    </h4>

                    <div className="flex items-center justify-around py-4">
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-[#eff4ff] border-4 border-[#3525cd] flex items-center justify-center font-bold text-[18px] text-[#3525cd] font-mono">
                          {creator.demographics.gender.female}%
                        </div>
                        <span className="text-[12px] font-semibold text-[#0b1c30] mt-2">Female</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-[#eff4ff] border-4 border-[#39b8fd] flex items-center justify-center font-bold text-[18px] text-[#006591] font-mono">
                          {creator.demographics.gender.male}%
                        </div>
                        <span className="text-[12px] font-semibold text-[#0b1c30] mt-2">Male</span>
                      </div>
                    </div>

                    <div className="bg-[#eff4ff] p-2.5 rounded-xl text-[12px] text-[#464555] text-center">
                      Verified audience authenticity rating: <strong className="text-[#005338]">{creator.authenticityScore}%</strong>
                    </div>
                  </div>
                </div>

                {/* Geography & Interests */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Geography */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <h4 className="font-bold text-[14px] text-[#0b1c30] font-['Geist'] mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-[#005338]">
                        public
                      </span>
                      <span>Audience Geography</span>
                    </h4>
                    <div className="space-y-2.5">
                      {creator.demographics.geography.map((geo) => (
                        <div key={geo.country} className="flex items-center justify-between text-[13px]">
                          <span className="text-[#464555]">{geo.country}</span>
                          <span className="font-bold text-[#0b1c30] font-mono">{geo.pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Audience Interests */}
                  <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
                    <h4 className="font-bold text-[14px] text-[#0b1c30] font-['Geist'] mb-3 flex items-center gap-2">
                      <span className="material-symbols-outlined text-[17px] text-[#3525cd]">
                        interests
                      </span>
                      <span>Audience Affinity & Interests</span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {creator.demographics.topInterests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1.5 rounded-xl bg-[#eff4ff] text-[#3525cd] text-[12px] font-semibold border border-[#dce9ff]"
                        >
                          #{interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: RECENT CONTENT & REELS FEED */}
            {activeTab === 'content' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-[16px] text-[#0b1c30] font-['Geist']">
                    Recent Reels, Shorts & Feed Posts
                  </h3>
                  <span className="text-[12px] text-[#464555] font-mono">
                    Pulled via Influship get_posts
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {creator.recentPosts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="relative aspect-4/3 w-full bg-[#f1f5f9]">
                        <img
                          src={post.thumbnail}
                          alt="Post thumbnail"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-white font-mono uppercase">
                          {post.type}
                        </span>
                        <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-[11px] text-white font-mono">
                          {post.views} views
                        </span>
                      </div>

                      <div className="p-3.5 flex-1 flex flex-col justify-between">
                        <p className="text-[12px] text-[#0b1c30] leading-snug line-clamp-3 mb-3">
                          {post.caption}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f9] text-[11px] font-mono text-[#464555]">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#ba1a1a]">
                              favorite
                            </span>
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[13px] text-[#006591]">
                              chat_bubble
                            </span>
                            {post.comments}
                          </span>
                          <span>{post.postedAt}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: MCP AUDIT & REASONING */}
            {activeTab === 'mcp' && (
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#3525cd] text-[22px]">
                      auto_awesome
                    </span>
                    <h3 className="font-bold text-[16px] text-[#0b1c30] font-['Geist']">
                      Influship MCP Algorithmic Decision Justification
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-[#6ffbbe]/30 text-[#002113]">
                    Decision: {creator.mcpAudit.decision}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="bg-[#eff4ff] p-4 rounded-xl border border-[#c3c0ff]">
                    <h4 className="font-semibold text-[13px] text-[#0b1c30] mb-1">
                      Semantic & Transcript Analysis
                    </h4>
                    <p className="text-[13px] text-[#464555] leading-relaxed">
                      {creator.mcpAudit.matchReason}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="text-[11px] text-[#464555] uppercase font-bold">
                        Brand Safety Index
                      </span>
                      <div className="text-[20px] font-bold text-[#005338] font-mono mt-0.5">
                        {creator.mcpAudit.brandSafetyScore}/100
                      </div>
                      <span className="text-[11px] text-[#464555]">
                        Zero policy violations detected
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl border border-[#e2e8f0]">
                      <span className="text-[11px] text-[#464555] uppercase font-bold">
                        Commercial Intent Score
                      </span>
                      <div className="text-[20px] font-bold text-[#3525cd] font-mono mt-0.5">
                        {creator.mcpAudit.commercialIntentScore}/100
                      </div>
                      <span className="text-[11px] text-[#464555]">
                        Strong purchase referral velocity
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#f8f9ff] border border-[#e2e8f0] text-[12px] font-mono text-[#464555] space-y-1">
                    <div>MCP Endpoint: https://server.smithery.ai/influship/influship-mcp</div>
                    <div>Canonical Tool: get_profile, match_creators, get_posts</div>
                    <div>Last Synchronized: {new Date(creator.lastSyncedAt).toISOString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
