import type { Intervention, AnalysisRadius } from '../types';
import React, { useState } from 'react';
import { computeChangeAnalysis } from '../utils/spectralEngine';
import { Search, CheckCircle2, AlertCircle, AlertTriangle, ShieldCheck, MapPin, Download, Trash2 } from 'lucide-react';

interface InterventionsTableProps {
  interventions: Intervention[];
  selectedId: string;
  onSelectIntervention: (id: string) => void;
  onViewAnalysis: (id: string) => void;
  beforeYear: number;
  afterYear: number;
  onBeforeYearChange: (year: number) => void;
  onAfterYearChange: (year: number) => void;
  radius: AnalysisRadius;
  onVerify: (remarks?: string) => void;
  onExportReport: () => void;
  onDeleteIntervention?: (id: string) => void;
}

export const InterventionsTable: React.FC<InterventionsTableProps> = ({
  interventions,
  selectedId,
  onSelectIntervention,
  onViewAnalysis,
  beforeYear,
  afterYear,
  onBeforeYearChange: _onBeforeYearChange,
  onAfterYearChange: _onAfterYearChange,
  radius: _radius,
  onVerify: _onVerify,
  onExportReport,
  onDeleteIntervention
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterWorkType, setFilterWorkType] = useState<string>('ALL');
  const [query, setQuery] = useState<string>('');

  const filtered = interventions.filter(item => {
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesType = filterWorkType === 'ALL' || item.workType === filterWorkType;
    const matchesQuery = !query || 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.id.toLowerCase().includes(query.toLowerCase()) ||
      item.locationName.toLowerCase().includes(query.toLowerCase());
    return matchesStatus && matchesType && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Registry Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-slate-800">
        {/* Header controls */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-100 text-rose-800 font-bold px-2.5 py-0.5 rounded-full text-xs">
                Interventions Registry
              </span>
              <h3 className="text-base font-bold text-slate-900 font-outfit">
                Geo-Tagged Field Interventions Directory
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing {filtered.length} of {interventions.length} records linked to DRISHTI & Bhuvan satellite archives
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search ID / Location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-white border border-slate-300 rounded-xl pl-8 pr-2.5 py-1.5 font-medium focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer focus:border-rose-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="Verified">Verified Only</option>
              <option value="NeedsReview">Needs Review</option>
              <option value="PriorityInspection">Priority Inspection</option>
            </select>

            {/* Work Type Filter */}
            <select
              value={filterWorkType}
              onChange={(e) => setFilterWorkType(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-bold text-slate-700 cursor-pointer focus:border-rose-500"
            >
              <option value="ALL">All Work Types</option>
              <option value="FarmPond">Farm Ponds</option>
              <option value="CheckDam">Check Dams</option>
              <option value="Trench">Contour Trenches</option>
              <option value="Plantation">Plantations</option>
              <option value="Bund">Bundings</option>
              <option value="RechargePit">Recharge Pits</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">ID & Work Title</th>
                <th className="px-4 py-2.5">Work Category</th>
                <th className="px-4 py-2.5">GPS Geotag Coords</th>
                <th className="px-4 py-2.5">Capture Date</th>
                <th className="px-4 py-2.5">Satellite Trend</th>
                <th className="px-4 py-2.5">Status Badge</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filtered.map(item => {
                const isSelected = item.id === selectedId;
                const change = computeChangeAnalysis(item, beforeYear, afterYear);

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectIntervention(item.id)}
                    className={`cursor-pointer transition-all ${
                      isSelected ? 'bg-rose-50/80 font-medium border-l-4 border-l-rose-600' : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Title & Photo Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.photoUrl} alt={item.title} className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-xs" />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{item.title}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-1.5 py-0.2 rounded border border-slate-200">
                              {item.id}
                            </span>
                          </div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            <span>{item.locationName}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Work Type */}
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      {item.workType}
                    </td>

                    {/* Geotag */}
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-600">
                      <div>{item.latitude.toFixed(4)}° N, {item.longitude.toFixed(4)}° E</div>
                      <div className="text-[10px] text-emerald-700 font-sans flex items-center gap-0.5 mt-0.5">
                        <ShieldCheck className="w-3 h-3" /> EXIF Geotag Verified
                      </div>
                    </td>

                    {/* Capture Date */}
                    <td className="px-4 py-3 text-slate-600">
                      {item.captureDateTime}
                    </td>

                    {/* Trend */}
                    <td className="px-4 py-3">
                      {change.trend === 'Improved' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          NDVI +{change.ndviChange} (Improved)
                        </span>
                      ) : change.trend === 'Declined' ? (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">
                          NDVI {change.ndviChange} (Decline)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                          Stable Change
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3">
                      {item.status === 'Verified' && (
                        <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      )}
                      {item.status === 'NeedsReview' && (
                        <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Needs Review
                        </span>
                      )}
                      {item.status === 'PriorityInspection' && (
                        <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Priority Inspection
                        </span>
                      )}
                    </td>

                    {/* Right Corner Actions: View Analysis, Download Report, and Delete */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIntervention(item.id);
                            onViewAnalysis(item.id);
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-xl font-bold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          title="Open dedicated Integrated Field Analysis & Comparison page"
                        >
                          <span>View Analysis</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectIntervention(item.id);
                            onExportReport();
                          }}
                          className="text-xs px-2.5 py-1.5 rounded-xl font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                          title="Download Complete Comprehensive PDF Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Report</span>
                        </button>

                        {onDeleteIntervention && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Are you sure you want to permanently delete intervention "${item.title}" (${item.id})? This will remove it from the central database and all GIS map layers.`)) {
                                onDeleteIntervention(item.id);
                              }
                            }}
                            className="text-xs p-1.5 rounded-xl font-bold bg-slate-100 hover:bg-rose-100 text-slate-500 hover:text-rose-600 transition-all border border-slate-200 hover:border-rose-300 cursor-pointer shadow-xs"
                            title="Delete this intervention from the central database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
