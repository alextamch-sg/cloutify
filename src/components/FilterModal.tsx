/**
 * @file src/components/FilterModal.tsx
 * Advanced Filter Sheet modal for KOL Discovery
 */

import React from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedCountry: string;
  onSelectCountry: (c: string) => void;
  minScore: number | null;
  onSetMinScore: (score: number | null) => void;
  minFollowers: number | null;
  onSetMinFollowers: (f: number | null) => void;
  onReset: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedCountry,
  onSelectCountry,
  minScore,
  onSetMinScore,
  minFollowers,
  onSetMinFollowers,
  onReset,
}) => {
  if (!isOpen) return null;

  const categories = [
    'All',
    'Dating & Relationships',
    'Tech & Gadgets',
    'Food & Dining',
    'Fashion & Luxury',
    'Fitness & Wellness',
    'Finance & Wealth',
    'Travel & Escapes',
    'Comedy & Entertainment',
    'Beauty & Skincare',
    'Gaming & Esports',
    'Lifestyle SG',
  ];

  const countries = ['All Countries', 'Singapore', 'Malaysia', 'Regional SE Asia'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full border border-[#e2e8f0] shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#3525cd]">tune</span>
            <h3 className="font-bold text-[16px] text-[#0b1c30] font-['Geist']">
              Filter KOL Discovery
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#464555] hover:bg-[#eff4ff]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Filters */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Country Selection */}
          <div>
            <label className="block text-[12px] font-bold text-[#464555] uppercase tracking-wider mb-2 font-['Geist']">
              Target Country / Cluster
            </label>
            <div className="flex flex-wrap gap-2">
              {countries.map((c) => {
                const isAll = c === 'All Countries';
                const isSelected = isAll ? !selectedCountry : selectedCountry === c;
                return (
                  <button
                    key={c}
                    onClick={() => onSelectCountry(isAll ? '' : c === selectedCountry ? '' : c)}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors border ${
                      isSelected
                        ? 'bg-[#c9e6ff] text-[#001e2f] border-[#89ceff]'
                        : 'bg-white text-[#464555] border-[#e2e8f0] hover:bg-[#eff4ff]'
                    }`}
                  >
                    {c === 'Singapore' ? '🇸🇬 ' : c === 'Malaysia' ? '🇲🇾 ' : ''}
                    {c}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-[12px] font-bold text-[#464555] uppercase tracking-wider mb-2 font-['Geist']">
              Niche & Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat === 'All' ? '' : cat === selectedCategory ? '' : cat)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-semibold transition-colors border ${
                    (cat === 'All' && !selectedCategory) || selectedCategory === cat
                      ? 'bg-[#3525cd] text-white border-[#3525cd]'
                      : 'bg-white text-[#464555] border-[#e2e8f0] hover:bg-[#eff4ff]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Score Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[12px] font-bold text-[#464555] uppercase tracking-wider font-['Geist']">
                Min. Algorithmic Score
              </label>
              <span className="font-mono font-bold text-[13px] text-[#3525cd]">
                {minScore || 0} / 100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="95"
              step="5"
              value={minScore || 0}
              onChange={(e) => onSetMinScore(Number(e.target.value) || null)}
              className="w-full accent-[#3525cd] cursor-pointer"
            />
          </div>

          {/* Followers Minimum */}
          <div>
            <label className="block text-[12px] font-bold text-[#464555] uppercase tracking-wider mb-2 font-['Geist']">
              Audience Follower Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Any', value: null },
                { label: '100K+', value: 100000 },
                { label: '200K+', value: 200000 },
              ].map((tier) => (
                <button
                  key={tier.label}
                  onClick={() => onSetMinFollowers(tier.value)}
                  className={`py-2 rounded-xl text-[12px] font-semibold text-center border transition-colors ${
                    minFollowers === tier.value
                      ? 'bg-[#eff4ff] text-[#3525cd] border-[#3525cd]'
                      : 'bg-white text-[#464555] border-[#e2e8f0] hover:bg-[#eff4ff]'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e8f0] flex items-center justify-between bg-[#f8f9ff]">
          <button
            onClick={onReset}
            className="text-[13px] font-semibold text-[#464555] hover:text-[#ba1a1a] transition-colors"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#3525cd] text-white text-[13px] font-semibold shadow-xs hover:bg-[#4f46e5] transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
