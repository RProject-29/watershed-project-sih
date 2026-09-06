import React from 'react';
import {
  Globe,
  Map,
  Layers,
  TrendingUp,
  Compass,
  Database,
  Table,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export type TabType = 'Dashboard' | 'Analysis' | 'MultiMap' | 'BeforeAfter' | 'TimeSeries' | 'Planning' | 'Repository' | 'Registry';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  selectedInterventionTitle?: string;
  selectedInterventionId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isCollapsed,
  onToggleCollapse,
  selectedInterventionTitle,
  selectedInterventionId
}) => {
  const navItems: { id: TabType; label: string; icon: React.ElementType; color: string; badge?: string }[] = [
    { id: 'Dashboard', label: 'Officer Dashboard', icon: Map, color: 'text-emerald-400' },
    { id: 'Analysis', label: 'Field Analysis & Comparison', icon: Layers, color: 'text-teal-400', badge: 'Integrated' },
    { id: 'TimeSeries', label: 'Time-Series Trends', icon: TrendingUp, color: 'text-purple-400' },
    { id: 'Planning', label: 'Advanced Planning (DEM)', icon: Compass, color: 'text-amber-400', badge: 'GIS' },
    { id: 'Repository', label: 'Data Repository', icon: Database, color: 'text-indigo-400' },
    { id: 'Registry', label: 'Interventions Registry', icon: Table, color: 'text-rose-400' }
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-all duration-300 z-40 sticky top-0 h-screen ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Branding Section */}
      <div>
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-950/60 border border-emerald-400/30">
              <Globe className="w-6 h-6 text-white" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-extrabold text-lg font-outfit tracking-tight text-white">
                    JALDRISHTI
                  </h1>
                  <span className="text-[10px] bg-emerald-950 border border-emerald-700/80 px-1.5 py-0.2 rounded text-emerald-400 font-bold">
                    v2.4 GIS
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-sans truncate">
                  Watershed Monitoring Portal
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1.5 mt-2">
          {!isCollapsed && (
            <div className="px-3 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Navigation Modules
            </div>
          )}

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all font-medium text-xs group cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-slate-800 to-slate-850 text-white border border-slate-700/80 shadow-md font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <div className="flex items-center gap-3 truncate">
                  <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${item.color}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!isCollapsed && item.badge && (
                  <span className="text-[9px] bg-slate-800 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info Section */}
      {!isCollapsed && (
        <div className="p-3 m-2 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Active Selection</span>
          </div>
          {selectedInterventionTitle ? (
            <div className="text-[11px] text-slate-300 font-medium truncate">
              {selectedInterventionTitle} <span className="font-mono text-slate-400">({selectedInterventionId})</span>
            </div>
          ) : (
            <div className="text-[11px] text-slate-500">None selected</div>
          )}
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800/80 flex items-center justify-between">
            <span>ISRO NRSC Protocol</span>
            <span className="text-emerald-500 font-bold">IWMP Protocol</span>
          </div>
        </div>
      )}
    </aside>
  );
};
