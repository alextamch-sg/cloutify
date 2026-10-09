/**
 * @file src/components/BenchmarkModal.tsx
 * Modal for Sync Custom Tracker / Audience Overlap Benchmarking across selected 4 KOLs
 */

import React, { useState, useEffect } from 'react';
import { fetchBenchmarks } from '../services/api';
import { Creator } from '../types';

interface BenchmarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCreators: Creator[];
}

export const BenchmarkModal: React.FC<BenchmarkModalProps> = ({
  isOpen,
  onClose,
  selectedCreators,
}) => {
  const [loading, setLoading] = useState(false);
  const [benchmarkData, setBenchmarkData] = useState<{
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
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchBenchmarks()
        .then((data) => setBenchmarkData(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#e2e8f0] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#e2e8f0] flex items-center justify-between sticky top-0 bg-white z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#3525cd] text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">compare</span>
            </div>
            <div>
              <h2 className="font-bold text-[16px] text-[#0b1c30] font-['Geist'] leading-tight">
                Sync Custom Tracker: 4 KOL Audience Overlap
              </h2>
              <span className="text-[12px] text-[#464555]">
                Deduplicated reach & synergy analysis in Singapore cluster
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#464555] hover:bg-[#eff4ff] transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Summary Callout Banner */}
          <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#c3c0ff] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase text-[#3525cd] tracking-wider block">
                Audience Synergy Index
              </span>
              <div className="text-[20px] font-bold text-[#0b1c30] font-['Geist']">
                {benchmarkData?.overlapSummary.overlapIndex || '28.4%'} Overlap Rate
              </div>
              <p className="text-[12px] text-[#464555] mt-0.5">
                {benchmarkData?.overlapSummary.sharedAudienceTotal || '64.2K Unique SG Users'} share common active affinity
              </p>
            </div>

            <div className="bg-white px-3 py-2 rounded-lg border border-[#e2e8f0] text-[12px] font-mono">
              <span className="text-[#464555] block text-[10px]">TOTAL GROSS REACH</span>
              <span className="font-bold text-[#005338]">842,000 Impressions</span>
            </div>
          </div>

          {/* Table Comparison */}
          <div className="border border-[#e2e8f0] rounded-xl overflow-hidden">
            <table className="w-full text-left text-[12px]">
              <thead className="bg-[#f8f9ff] text-[#464555] border-b border-[#e2e8f0] font-['Geist'] uppercase text-[11px]">
                <tr>
                  <th className="p-3">Creator</th>
                  <th className="p-3 text-center">Score</th>
                  <th className="p-3 text-center">Followers</th>
                  <th className="p-3 text-center">Eng. Rate</th>
                  <th className="p-3 text-center">Overlap</th>
                  <th className="p-3 text-right">Est. CPM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {(benchmarkData?.comparison || selectedCreators.slice(0, 4)).map((item, i) => {
                  const c = item as {
                    id?: string;
                    name: string;
                    handle: string;
                    score: number;
                    followers?: string;
                    followersDisplay?: string;
                    engagementRate?: string;
                    engagementRateDisplay?: string;
                    audienceOverlapPct?: number;
                    cpmEstimate?: string;
                  };
                  return (
                    <tr key={c.id || i} className="hover:bg-[#f8f9ff] transition-colors">
                      <td className="p-3">
                        <div className="font-semibold text-[#0b1c30]">{c.name}</div>
                        <div className="text-[#464555] text-[11px] font-mono">{c.handle}</div>
                      </td>
                      <td className="p-3 text-center">
                        <span className="font-bold text-[#0b1c30] bg-[#eff4ff] px-2 py-0.5 rounded-md">
                          {c.score}/100
                        </span>
                      </td>
                      <td className="p-3 text-center font-mono font-medium">
                        {c.followersDisplay || c.followers || '200K'}
                      </td>
                      <td className="p-3 text-center font-mono font-bold text-[#005338]">
                        {c.engagementRateDisplay || c.engagementRate || '4.5%'}
                      </td>
                      <td className="p-3 text-center font-mono text-[#3525cd]">
                        {c.audienceOverlapPct || [22, 18, 14, 12][i]}%
                      </td>
                      <td className="p-3 text-right font-mono font-semibold text-[#0b1c30]">
                        {c.cpmEstimate || `$${24 + i * 4}`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Strategic Recommendation */}
          <div className="p-3.5 bg-white rounded-xl border border-[#e2e8f0] text-[12px] space-y-1.5">
            <div className="font-bold text-[#0b1c30] flex items-center gap-1.5 font-['Geist']">
              <span className="material-symbols-outlined text-[16px] text-emerald-600">
                recommend
              </span>
              <span>Influship MCP Media Mix Recommendation</span>
            </div>
            <p className="text-[#464555] leading-relaxed">
              Pairing <strong>Cheryl Tan</strong> with <strong>Marcus &amp; Sarah</strong> yields maximum demographic coverage across singles and coupled millennials in Singapore with minimal cannibalization (&lt;24% overlap).
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#e2e8f0] bg-white flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#eff4ff] text-[#0b1c30] text-[13px] font-semibold hover:bg-[#dce9ff] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
