/**
 * @file src/components/Header.tsx
 * Web-based Desktop Navigation Bar
 */

import React from 'react';
import { McpConnectionStatus } from '../types';

export type NavTab = 'discovery' | 'shortlist' | 'campaigns' | 'analytics';

interface HeaderProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  mcpStatus: McpConnectionStatus | null;
  onOpenMcpModal: () => void;
  onOpenHealthModal: () => void;
  shortlistCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  mcpStatus,
  onOpenMcpModal,
  onOpenHealthModal,
  shortlistCount,
}) => {
  return (
    <header className="sticky top-0 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#e2e8f0] shadow-[0_1px_8px_rgba(11,28,48,0.04)]">
      <div className="max-w-[1600px] mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-8">
          <div
            onClick={() => onTabChange('discovery')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              alt="Cloutify Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="https://lh3.googleusercontent.com/aida/AEtjO1W4kl_RFC-KS_B5mYmHhZOakS8ch8GwLiZdsWYBHruyPYc_XeRf2FtzO7TgDAO2fVFqGEBv1glfdpD705etANc_6gSs6t8JgnbH4lNhFPGPk-WPPZ9nW-4p-4gAijJNuRgCS4p1T9rOu5fW2rmsZ4Q7iLgWixcRPsSN4F-6_c9GRyaaTBQ_qz5zAhw8eViUPeIuXxqPvSBLL1vcSpAXUZBiADrZ-8AkjO0OhH23NkPMekt5pb1RI0NMhxw"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[18px] text-[#0b1c30] tracking-tight leading-none font-['Geist']">
                Cloutify
              </span>
              <span className="text-[11px] font-semibold text-[#464555] uppercase tracking-wider font-['Geist'] mt-0.5">
                Creator Intelligence
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Tabs */}
          <nav className="flex items-center gap-1.5">
            <button
              onClick={() => onTabChange('discovery')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all font-['Geist'] ${
                activeTab === 'discovery'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">manage_search</span>
              <span>KOL Discovery</span>
            </button>

            <button
              onClick={() => onTabChange('shortlist')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all font-['Geist'] relative ${
                activeTab === 'shortlist'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">bookmark_manager</span>
              <span>Shortlist</span>
              {shortlistCount > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    activeTab === 'shortlist'
                      ? 'bg-white text-[#3525cd]'
                      : 'bg-[#3525cd] text-white'
                  }`}
                >
                  {shortlistCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('campaigns')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all font-['Geist'] ${
                activeTab === 'campaigns'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">campaign</span>
              <span>Campaigns</span>
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold transition-all font-['Geist'] ${
                activeTab === 'analytics'
                  ? 'bg-[#3525cd] text-white shadow-xs'
                  : 'text-[#464555] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">monitoring</span>
              <span>Cluster Analytics</span>
            </button>
          </nav>
        </div>

        {/* Right Tools: Health, Influship MCP, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* API Health Monitor Button */}
          <button
            onClick={onOpenHealthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors shadow-xs"
            title="Monitor API & System Health"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-['Geist']">API Health</span>
            <span className="material-symbols-outlined text-[15px] text-emerald-600">monitor_heart</span>
          </button>

          {/* Influship MCP Status Pill */}
          <button
            onClick={onOpenMcpModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold bg-[#eff4ff] hover:bg-[#dce9ff] text-[#3525cd] border border-[#c3c0ff] transition-all cursor-pointer shadow-xs"
            title="Influship MCP Server Status & Tools"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                mcpStatus?.isOnline ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
            <span className="font-mono">Influship MCP</span>
            <span className="text-[10px] bg-[#3525cd] text-white px-1.5 py-0.5 rounded-full font-mono">
              {mcpStatus?.latencyMs ? `${mcpStatus.latencyMs}ms` : 'Online'}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              aria-label="Notifications"
              className="w-9 h-9 flex items-center justify-center rounded-lg text-[#464555] hover:text-[#0b1c30] hover:bg-[#eff4ff] transition-colors border border-[#e2e8f0]"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
          </div>

          {/* Account Profile with Enterprise tag */}
          <div className="flex items-center gap-2 pl-2 border-l border-[#e2e8f0]">
            <img
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-[#e2e8f0]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBT-nAc0xgslGig8ZO6Da8vYpVxdZW1FOJNPPoHhI6_edKHBePAFG9ph0uDGI4G5jJhoDTTKaBxZNMQOamC1ccodBRAKI2DShL8ub_Vlj-QebU5n10zMlAWD-4YDnSVe979JId6PuRn0RXWbYDdzcM72xKD9F6Nnmv0IKXxhk44Sbsed98dL91FG1W_MGUxSG8VjQd_QoSRhpAehtbZi4uFS4SZn-DG1AXRcs7BUi4sxdDZ5yda6Mci"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-[12px] font-bold text-[#0b1c30] font-['Geist'] leading-tight">
                Enterprise Lead
              </span>
              <span className="text-[10px] text-[#464555] font-mono">
                SG Cluster • Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
