import type { AnalysisRadius } from '../types';
import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, MapPin, Calendar, Compass } from 'lucide-react';

interface SummaryBarProps {
  totalCount: number;
  verifiedCount: number;
  needsReviewCount: number;
  priorityCount: number;
  radius: AnalysisRadius;
  onRadiusChange: (r: AnalysisRadius) => void;
  beforeYear: number;
  afterYear: number;
  onBeforeYearChange: (y: number) => void;
  onAfterYearChange: (y: number) => void;
}

export const SummaryBar: React.FC<SummaryBarProps> = ({
  totalCount,
  verifiedCount,
  needsReviewCount,
  priorityCount,
  radius,
  onRadiusChange,
  beforeYear,
  afterYear,
  onBeforeYearChange,
  onAfterYearChange
}) => {
  return (
    <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total */}
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2">
            <div className="p-2 bg-slate-200 text-slate-700 rounded-md">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Works</div>
              <div className="text-lg font-extrabold text-slate-900 leading-tight">{totalCount}</div>
            </div>
          </div>

          {/* Verified */}
          <div className="flex items-center gap-3 bg-emerald-50/70 border border-emerald-200 rounded-lg px-3 py-2">
            <div className="p-2 bg-emerald-100 text-emerald-700 rounded-md">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-emerald-700 uppercase tracking-wider">Verified (+ Change)</div>
              <div className="text-lg font-extrabold text-emerald-800 leading-tight">{verifiedCount}</div>
            </div>
          </div>

          {/* Needs Review */}
          <div className="flex items-center gap-3 bg-amber-50/70 border border-amber-200 rounded-lg px-3 py-2">
            <div className="p-2 bg-amber-100 text-amber-700 rounded-md">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-amber-700 uppercase tracking-wider">Needs Review</div>
              <div className="text-lg font-extrabold text-amber-800 leading-tight">{needsReviewCount}</div>
            </div>
          </div>

          {/* Priority Inspection */}
          <div className="flex items-center gap-3 bg-rose-50/70 border border-rose-200 rounded-lg px-3 py-2">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-md">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-medium text-rose-700 uppercase tracking-wider">Priority Inspection</div>
              <div className="text-lg font-extrabold text-rose-800 leading-tight">{priorityCount}</div>
            </div>
          </div>
        </div>

        {/* Satellite Analysis Buffer & Time Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-100/80 p-1.5 rounded-xl border border-slate-200 text-xs">
          {/* Radius Selector */}
          <div className="flex items-center gap-1.5 px-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-slate-700">Analysis Buffer:</span>
            <div className="inline-flex rounded-lg p-0.5 bg-slate-200 text-slate-700 font-medium">
              <button
                onClick={() => onRadiusChange(500)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  radius === 500 ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                500m
              </button>
              <button
                onClick={() => onRadiusChange(1000)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  radius === 1000 ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                1 km (Focus)
              </button>
              <button
                onClick={() => onRadiusChange(2000)}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  radius === 2000 ? 'bg-emerald-600 text-white font-bold shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                2 km
              </button>
            </div>
          </div>

          <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>

          {/* Time Series Compare Selector */}
          <div className="flex items-center gap-1.5 px-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Baseline:</span>
            <select
              value={beforeYear}
              onChange={(e) => onBeforeYearChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-bold text-slate-800 cursor-pointer focus:border-emerald-500"
            >
              {[2021, 2022, 2023, 2024, 2025].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <span className="text-slate-400 font-bold">vs</span>
            <span className="font-semibold text-slate-700">Target:</span>
            <select
              value={afterYear}
              onChange={(e) => onAfterYearChange(Number(e.target.value))}
              className="bg-white border border-slate-300 rounded px-1.5 py-0.5 font-bold text-slate-800 cursor-pointer focus:border-emerald-500"
            >
              {[2022, 2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y} disabled={y <= beforeYear}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
