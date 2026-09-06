import React, { useState } from 'react';
import { Download, Search, Key, LogOut, ShieldCheck, MapPin, FileCheck, CheckCircle2, ChevronDown, X } from 'lucide-react';
import { hasValidCredentials } from '../utils/copernicusService';

interface HeaderProps {
  userName: string;
  userRole: string;
  onLogout: () => void;
  onOpenUpload?: () => void;
  onOpenCopernicusSettings: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedWatershed: string;
  onWatershedChange: (name: string) => void;
  onExportReport: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Dr. R. K. Sharma',
  userRole = 'District Watershed Officer',
  onLogout,
  onOpenUpload: _onOpenUpload,
  onOpenCopernicusSettings,
  searchTerm,
  onSearchChange,
  selectedWatershed,
  onWatershedChange,
  onExportReport
}) => {
  const isCopernicusLive = hasValidCredentials();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const safeName = userName || 'Dr. R. K. Sharma';
  const safeRole = userRole || 'District Watershed Officer';

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top Banner for Official Project Mission & Protocol */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-bold px-2 py-0.5 rounded text-[10px] tracking-wider uppercase flex items-center gap-1">
            ISRO NRSC • DoLR
          </span>
          <span className="text-slate-200 font-medium text-xs">
            National Remote Sensing Geospatial Evaluation & Decision-Support System for Integrated Watershed Management (IWMP)
          </span>
        </div>
        <div className="hidden md:flex items-center gap-4 text-[11px] text-slate-400">
          <span>Ministry of Rural Development (DoLR)</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Bhuvan & Sentinel-2 Synchronized</span>
        </div>
      </div>

      {/* Main Nav Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Search & Watershed Filter */}
        <div className="flex-1 max-w-lg flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search Intervention ID, Village, or Work Type..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <select
            value={selectedWatershed}
            onChange={(e) => onWatershedChange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Watersheds (IWMP Micro-Watershed)</option>
            <option value="Hiware Bazar">Hiware Bazar Micro-Watershed</option>
            <option value="Ralegan Siddhi">Ralegan Siddhi Catchment</option>
          </select>
        </div>

        {/* Action Buttons & Officer Profile Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCopernicusSettings}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl font-medium border transition-all cursor-pointer ${
              isCopernicusLive
                ? 'bg-teal-950/80 border-teal-500 text-teal-300 hover:bg-teal-900'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
            title="Configure Copernicus Live Satellite API Credentials"
          >
            <Key className={`w-3.5 h-3.5 ${isCopernicusLive ? 'text-teal-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isCopernicusLive ? 'Copernicus Live API' : 'Copernicus Setup'}</span>
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-medium text-xs px-3 py-1.5 rounded-xl transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">GIS Report</span>
          </button>

          {/* Top-Right Officer Profile Badge */}
          <div className="relative border-l border-slate-800 pl-2 ml-1">
            <button
              onClick={() => setIsProfileModalOpen(!isProfileModalOpen)}
              className="flex items-center gap-2 p-1.5 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-xl transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center font-bold text-white text-xs shadow-xs">
                {safeName.charAt(0)}
              </div>
              <div className="hidden lg:block truncate max-w-[130px]">
                <div className="text-xs font-bold text-slate-100 leading-tight truncate">{safeName}</div>
                <div className="text-[10px] text-emerald-400 truncate">{safeRole}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Officer Profile Modal / Card */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-2xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100 font-outfit">Government Officer Profile</h3>
              </div>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Officer Details */}
            <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-white text-lg shadow-md">
                {safeName.charAt(0)}
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{safeName}</h4>
                <p className="text-xs text-emerald-400 font-medium">{safeRole}</p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: DOLR-MH-8821</p>
              </div>
            </div>

            {/* Assigned Details */}
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  Assigned Region:
                </span>
                <span className="font-bold text-slate-200">Hiware Bazar Watershed</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <FileCheck className="w-3.5 h-3.5 text-teal-400" />
                  Interventions Verified:
                </span>
                <span className="font-mono font-bold text-emerald-400">16 / 24 Sites</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/60">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                  Audit Status:
                </span>
                <span className="bg-emerald-950 border border-emerald-700 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded">
                  Active & Compliant
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  onLogout();
                }}
                className="w-full py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout Officer Session</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
