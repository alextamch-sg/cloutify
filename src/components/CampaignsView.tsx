/**
 * @file src/components/CampaignsView.tsx
 * Campaigns Tab showing active creator collaborations & outreach pipeline
 */

import React from 'react';

export const CampaignsView: React.FC = () => {
  const activeCampaigns = [
    {
      id: 'camp-1',
      title: 'Singapore Valentine Dating Guides 2026',
      brand: 'Love, Bonito x Tinder SG',
      budget: '$24,000 SGD',
      status: 'In Flight',
      creatorsCount: 4,
      totalReach: '380K Impressions',
      deliverablesCompleted: '6 / 8 Posts',
    },
    {
      id: 'camp-2',
      title: 'Speakeasy & Twilight Date Spots Q1',
      brand: 'Marina Bay Sands Hospitality',
      budget: '$18,500 SGD',
      status: 'Briefing',
      creatorsCount: 2,
      totalReach: '190K Impressions',
      deliverablesCompleted: '1 / 4 Posts',
    },
  ];

  return (
    <div className="flex flex-col w-full pb-8 px-4 sm:px-6 pt-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[20px] font-bold text-[#0b1c30] font-['Geist'] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#3525cd]">campaign</span>
            <span>Campaign Workspaces</span>
          </h2>
          <p className="text-[13px] text-[#464555]">
            Track deliverables, briefs, and live post verification across creator rosters
          </p>
        </div>

        <button
          onClick={() => alert('New Campaign flow initialized')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#3525cd] text-white text-[12px] font-semibold shadow-xs hover:bg-[#4f46e5]"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>New Campaign</span>
        </button>
      </div>

      <div className="space-y-4">
        {activeCampaigns.map((camp) => (
          <div
            key={camp.id}
            className="bg-white rounded-2xl border border-[#e2e8f0] p-5 shadow-xs hover:border-[#c3c0ff] transition-all"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
              <div>
                <span className="text-[11px] font-mono text-[#3525cd] font-semibold bg-[#eff4ff] px-2 py-0.5 rounded-md">
                  {camp.brand}
                </span>
                <h3 className="font-bold text-[16px] text-[#0b1c30] mt-1 font-['Geist']">
                  {camp.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#6ffbbe]/30 text-[#002113]">
                {camp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-[#eff4ff] rounded-xl text-center text-[12px]">
              <div>
                <span className="text-[10px] text-[#464555] uppercase block">Budget</span>
                <span className="font-bold text-[#0b1c30] font-mono">{camp.budget}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#464555] uppercase block">KOLs Active</span>
                <span className="font-bold text-[#3525cd] font-mono">{camp.creatorsCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#464555] uppercase block">Est. Reach</span>
                <span className="font-bold text-[#005338] font-mono">{camp.totalReach}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#464555] uppercase block">Deliverables</span>
                <span className="font-bold text-[#0b1c30] font-mono">{camp.deliverablesCompleted}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
