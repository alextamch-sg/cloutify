/**
 * @file src/components/AnalyticsView.tsx
 * Macro analytics & sentiment audit of the Singapore KOL cluster
 */

import React from 'react';

export const AnalyticsView: React.FC = () => {
  return (
    <div className="flex flex-col w-full pb-8 px-4 sm:px-6 pt-3">
      <div className="mb-4">
        <h2 className="text-[20px] font-bold text-[#0b1c30] font-['Geist'] flex items-center gap-2">
          <span className="material-symbols-outlined text-[#3525cd]">monitoring</span>
          <span>Cluster Intelligence & Macro Analytics</span>
        </h2>
        <p className="text-[13px] text-[#464555]">
          Aggregated sentiment, CPM index, and saturation trends across 42 Singapore Dating KOLs
        </p>
      </div>

      <div className="space-y-4">
        {/* KPI Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-bold text-[#464555] uppercase block">
              Average Cluster CPM
            </span>
            <div className="text-[22px] font-bold text-[#0b1c30] font-mono mt-1">$28.40</div>
            <span className="text-[11px] text-[#005338]">+3.2% vs Q4 2025</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-bold text-[#464555] uppercase block">
              Cluster Engagement
            </span>
            <div className="text-[22px] font-bold text-[#005338] font-mono mt-1">4.62%</div>
            <span className="text-[11px] text-[#464555]">Top tier regional rank</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-bold text-[#464555] uppercase block">
              Commercial Saturation
            </span>
            <div className="text-[22px] font-bold text-[#3525cd] font-mono mt-1">21.8%</div>
            <span className="text-[11px] text-[#005338]">Healthy organic balance</span>
          </div>

          <div className="bg-white p-4 rounded-xl border border-[#e2e8f0] shadow-xs">
            <span className="text-[11px] font-bold text-[#464555] uppercase block">
              Sentiment Index
            </span>
            <div className="text-[22px] font-bold text-[#0b1c30] font-mono mt-1">+0.82</div>
            <span className="text-[11px] text-[#005338]">Strong positive resonance</span>
          </div>
        </div>

        {/* Content Topics Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8f0] shadow-xs">
          <h3 className="font-bold text-[15px] text-[#0b1c30] font-['Geist'] mb-3">
            Dominant Content Themes in Singapore Dating
          </h3>
          <div className="space-y-3">
            {[
              { topic: 'BTO Housing & Relationship Milestones', share: 34, growth: '+18% MoM' },
              { topic: 'Budget-Friendly Date Cafes & Speakeasies', share: 28, growth: '+12% MoM' },
              { topic: 'Speed Dating, Mixers & Run Clubs', share: 22, growth: '+42% MoM (High Velocity)' },
              { topic: 'Dating App Humor & Red Flags in NUS/CBD', share: 16, growth: '+9% MoM' },
            ].map((t) => (
              <div key={t.topic}>
                <div className="flex justify-between text-[12px] font-semibold mb-1">
                  <span className="text-[#0b1c30]">{t.topic}</span>
                  <span className="text-[#3525cd] font-mono">{t.growth}</span>
                </div>
                <div className="w-full bg-[#f1f5f9] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#3525cd] h-full rounded-full"
                    style={{ width: `${t.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
