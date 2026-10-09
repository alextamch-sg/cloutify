/**
 * @file src/components/ShortlistView.tsx
 * Shortlisted Creators Management Screen
 */

import React from 'react';
import { Creator } from '../types';
import { CreatorCard } from './CreatorCard';

interface ShortlistViewProps {
  creators: Creator[];
  onSelectCreator: (creator: Creator) => void;
  onToggleShortlist: (id: string, e: React.MouseEvent) => void;
  onSyncSingleCreator: (id: string, e: React.MouseEvent) => void;
  onOpenBenchmark: () => void;
}

export const ShortlistView: React.FC<ShortlistViewProps> = ({
  creators,
  onSelectCreator,
  onToggleShortlist,
  onSyncSingleCreator,
  onOpenBenchmark,
}) => {
  const shortlisted = creators.filter((c) => c.shortlisted);

  return (
    <div className="flex flex-col w-full pb-8 px-4 sm:px-6 pt-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#0b1c30] font-['Geist'] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd]">bookmark</span>
            <span>Shortlisted KOLs ({shortlisted.length})</span>
          </h2>
          <p className="text-[13px] text-[#464555]">
            Curated talent queue ready for campaign outreach and briefing
          </p>
        </div>

        {shortlisted.length >= 2 && (
          <button
            onClick={onOpenBenchmark}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3525cd] text-white text-[12px] font-semibold shadow-xs hover:bg-[#4f46e5]"
          >
            <span className="material-symbols-outlined text-[16px]">compare</span>
            <span>Compare Queue</span>
          </button>
        )}
      </div>

      {shortlisted.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 text-center border border-[#e2e8f0]">
          <span className="material-symbols-outlined text-[48px] text-[#464555] mb-2">
            bookmark_border
          </span>
          <h3 className="font-bold text-[16px] text-[#0b1c30] mb-1">No creators in your shortlist yet</h3>
          <p className="text-[13px] text-[#464555] max-w-sm mx-auto">
            Click the bookmark icon on any creator card in the Discovery tab to save them here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {shortlisted.map((creator) => (
            <CreatorCard
              key={creator.id}
              creator={creator}
              onAuditProfile={onSelectCreator}
              onToggleShortlist={onToggleShortlist}
              onSyncProfile={onSyncSingleCreator}
            />
          ))}
        </div>
      )}
    </div>
  );
};
