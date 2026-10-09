/**
 * @file src/components/CreatorCard.tsx
 * Creator Card component adhering to the reference design & layout
 */

import React from 'react';
import { Creator } from '../types';

interface CreatorCardProps {
  creator: Creator;
  onAuditProfile: (creator: Creator) => void;
  onToggleShortlist: (id: string, e: React.MouseEvent) => void;
  onSyncProfile: (id: string, e: React.MouseEvent) => void;
  isSyncing?: boolean;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  onAuditProfile,
  onToggleShortlist,
  onSyncProfile,
  isSyncing = false,
}) => {
  // Platform icon helper
  const getPlatformIcon = (platform: Creator['platform']) => {
    switch (platform) {
      case 'instagram':
        return { icon: 'photo_camera', bg: 'bg-[#3525cd] text-white', label: 'Instagram' };
      case 'tiktok':
        return { icon: 'movie', bg: 'bg-[#39b8fd] text-[#004666]', label: 'TikTok' };
      case 'youtube':
        return { icon: 'smart_display', bg: 'bg-[#ba1a1a] text-white', label: 'YouTube' };
      default:
        return { icon: 'public', bg: 'bg-[#464555] text-white', label: 'Social' };
    }
  };

  // Tag styling helper
  const getTagBadgeStyle = (tag: string) => {
    if (tag.includes('Top Match')) {
      return 'bg-[#6ffbbe] text-[#002113]';
    }
    if (tag.includes('Organic')) {
      return 'bg-[#dce9ff] text-[#006591]';
    }
    if (tag.includes('Trending')) {
      return 'bg-[#c9e6ff] text-[#001e2f]';
    }
    if (tag.includes('Rising')) {
      return 'bg-[#6ffbbe] text-[#002113]';
    }
    return 'bg-[#e5eeff] text-[#0b1c30]';
  };

  const platformInfo = getPlatformIcon(creator.platform);

  return (
    <div
      onClick={() => onAuditProfile(creator)}
      className="bg-white rounded-xl p-3.5 sm:p-4 border border-[#e2e8f0] shadow-xs relative overflow-hidden transition-all hover:shadow-md hover:border-[#c3c0ff] cursor-pointer group"
    >
      {/* Top Meta Ribbons */}
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Avatar with platform badge */}
          <div className="relative shrink-0">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-11 h-11 rounded-full object-cover shadow-inner border border-[#e2e8f0]"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-xs ${platformInfo.bg}`}
              title={`Platform: ${platformInfo.label}`}
            >
              <span className="material-symbols-outlined text-[10px]">{platformInfo.icon}</span>
            </span>
          </div>

          {/* Name & Handle */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-[15px] sm:text-[16px] text-[#0b1c30] truncate leading-tight font-['Geist']">
                {creator.name}
              </span>
              {creator.verified && (
                <span
                  className="material-symbols-outlined text-[#006591] text-[16px]"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                  title="Verified Creator"
                >
                  verified
                </span>
              )}
              <span
                className={`px-1.5 py-0.5 rounded font-['Geist'] text-[10px] uppercase font-bold tracking-wider ${getTagBadgeStyle(
                  creator.tag
                )}`}
              >
                {creator.tag}
              </span>
            </div>
            <span className="text-[12px] text-[#464555] font-['Geist'] truncate">
              {creator.handle}
            </span>
          </div>
        </div>

        {/* Score Meter Segment */}
        <div className="flex flex-col items-end shrink-0">
          <div className="flex items-center gap-1 bg-[#eff4ff] px-2 py-0.5 rounded-lg border border-[#dce9ff]">
            <span className="text-[14px] text-[#0b1c30] font-bold font-['Geist']">
              {creator.score}
            </span>
            <span className="text-[11px] text-[#464555] font-['Geist']">/100</span>
          </div>

          {/* 3-Segment Traffic Light Pill */}
          <div
            className="flex items-center gap-0.5 mt-1"
            title={`Algorithmic Confidence: ${creator.scoreBreakdown.algorithmConfidence}`}
          >
            <div
              className="w-2.5 h-1 rounded-full bg-[#ba1a1a]"
              title={`Reach Score: ${creator.scoreBreakdown.reach}%`}
            />
            <div
              className="w-3 h-1 rounded-full bg-[#39b8fd]"
              title={`Sentiment Score: ${creator.scoreBreakdown.sentiment}%`}
            />
            <div
              className="w-4 h-1 rounded-full bg-[#006e4b]"
              title={`Conversion Tier: ${creator.scoreBreakdown.conversion}%`}
            />
          </div>
        </div>
      </div>

      {/* Category & Sub-niche Badges */}
      <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
        <span className="px-2 py-0.5 rounded-md bg-[#e5eeff] text-[11px] font-medium text-[#464555] font-['Geist']">
          {creator.category}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[11px] font-medium text-[#0b1c30] font-['Geist']">
          SG Local Audience ({creator.localAudiencePct}%)
        </span>
        {creator.shortlisted && (
          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-[#e2dfff] text-[#3323cc] text-[10px] font-semibold font-['Geist']">
            <span className="material-symbols-outlined text-[12px]">bookmark</span> Shortlisted
          </span>
        )}
      </div>

      {/* Gemini AI Match Justification (When queried via Gemini + Influship) */}
      {creator.geminiMatch && (
        <div className="flex items-start gap-2 p-2 bg-[#eff4ff] border border-[#c3c0ff] rounded-lg mb-2.5 shadow-xs">
          <span className="material-symbols-outlined text-[16px] text-[#3525cd] mt-0.5 shrink-0">
            auto_awesome
          </span>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-[#3525cd] font-['Geist'] uppercase">
                Gemini Match: {creator.geminiMatch.matchScore}%
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#3525cd] text-white rounded font-bold">
                {creator.geminiMatch.fitDecision}
              </span>
            </div>
            <p className="text-[11px] text-[#464555] line-clamp-1 mt-0.5 font-['Inter']">
              {creator.geminiMatch.matchReason}
            </p>
          </div>
        </div>
      )}

      {/* Core Quantitative Metric Ribbon */}
      <div className="grid grid-cols-4 gap-1.5 p-2 rounded-lg bg-[#eff4ff] mb-2.5 text-center border border-[#e5eeff]">
        <div className="flex flex-col">
          <span className="text-[11px] text-[#464555] font-['Geist']">Followers</span>
          <span className="text-[14px] text-[#0b1c30] font-bold font-['Geist'] tracking-tight">
            {creator.followersDisplay}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#464555] font-['Geist']">Eng. Rate</span>
          <span className="text-[14px] text-[#005338] font-bold font-['Geist'] tracking-tight">
            {creator.engagementRateDisplay}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#464555] font-['Geist']">Avg Impr</span>
          <span className="text-[14px] text-[#0b1c30] font-bold font-['Geist'] tracking-tight">
            {creator.avgImpressionsDisplay}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-[#464555] font-['Geist']">Avg Eng</span>
          <span className="text-[14px] text-[#0b1c30] font-bold font-['Geist'] tracking-tight">
            {creator.avgEngagementDisplay}
          </span>
        </div>
      </div>

      {/* Interaction Strip */}
      <div className="flex items-center justify-between pt-1 border-t border-[#f1f5f9]">
        <div className="flex items-center gap-1.5 text-[#464555] text-[11px]">
          <span className="material-symbols-outlined text-[14px] text-[#005338]">
            {creator.statusText.includes('Peak') ? 'trending_up' : creator.statusText.includes('Last') ? 'schedule' : 'pace'}
          </span>
          <span>
            {creator.statusText.split(':')[0]}:{' '}
            <strong className="text-[#0b1c30]">
              {creator.statusText.split(':')[1] || creator.statusText}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {/* Quick sync button */}
          <button
            onClick={(e) => onSyncProfile(creator.id, e)}
            disabled={isSyncing}
            className={`w-7 h-7 flex items-center justify-center rounded-lg bg-[#eff4ff] text-[#3525cd] hover:bg-[#dce9ff] transition-colors ${
              isSyncing ? 'animate-spin opacity-70' : ''
            }`}
            title="Sync this profile via Influship MCP"
          >
            <span className="material-symbols-outlined text-[15px]">sync</span>
          </button>

          {/* Bookmark Shortlist */}
          <button
            onClick={(e) => onToggleShortlist(creator.id, e)}
            className={`w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
              creator.shortlisted
                ? 'bg-[#e2dfff] text-[#3323cc]'
                : 'bg-[#eff4ff] text-[#464555] hover:text-[#3525cd]'
            }`}
            title={creator.shortlisted ? 'Remove from Shortlist' : 'Add to Shortlist'}
          >
            <span
              className="material-symbols-outlined text-[16px]"
              style={{ fontVariationSettings: creator.shortlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              bookmark
            </span>
          </button>

          {/* Audit Profile Button */}
          <button
            onClick={() => onAuditProfile(creator)}
            className="px-2.5 py-1 rounded-lg bg-[#e5eeff] text-[#0b1c30] text-[12px] font-semibold hover:bg-[#dce9ff] transition-colors flex items-center gap-1 font-['Geist']"
          >
            <span>Audit Profile</span>
            <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
