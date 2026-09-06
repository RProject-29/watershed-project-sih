import type { Intervention, SatelliteSnapshot, AnalysisRadius, ChangeAnalysis } from '../types';
import React from 'react';
import { MultiMapView } from './MultiMapView';
import { AIEvidencePanel } from './AIEvidencePanel';
import { MapPin, CheckCircle2, AlertCircle, AlertTriangle, Sparkles, Filter, ExternalLink } from 'lucide-react';

interface FieldDataAnalysisProps {
  interventions: Intervention[];
  selectedIntervention: Intervention;
  onSelectIntervention: (id: string) => void;
  selectedSnapshot: SatelliteSnapshot;
  changeAnalysis: ChangeAnalysis;
  radius: AnalysisRadius;
  onVerify: (remarks?: string) => void;
  onNavigateToRepository?: () => void;
}

export const FieldDataAnalysis: React.FC<FieldDataAnalysisProps> = ({
  interventions,
  selectedIntervention,
  onSelectIntervention,
  selectedSnapshot,
  changeAnalysis,
  radius,
  onVerify,
  onNavigateToRepository
}) => {
  // Show only 4 recent field entries in the analysis section
  const recentInterventions = interventions.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Module E: Field Data Analysis
            </span>
            <h2 className="text-lg font-extrabold font-outfit text-slate-100">
              Field Data Analysis & Satellite Extraction Registry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Select any uploaded field photo below to view its 3-Grid Multi-Spectral Satellite Maps, Technical Analysis & Recommended Action.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-slate-300 font-medium">Total Ingested Fields: <strong className="text-emerald-400 font-mono">{interventions.length}</strong></span>
        </div>
      </div>

      {/* Field Entries Gallery / Selector (Showing Top 4 Recent Entries) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-900 font-outfit flex items-center gap-2">
            <Filter className="w-4 h-4 text-emerald-600" />
            <span>Recent Officer Uploaded Field Entries (Showing 4 of {interventions.length})</span>
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">
              Click entry to view 3-Map Spectral Data
            </span>
            {onNavigateToRepository && (
              <button
                type="button"
                onClick={onNavigateToRepository}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>View All Saved Data in Repository</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* 4 Recent Gallery Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {recentInterventions.map((item) => {
            const isSelected = item.id === selectedIntervention.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectIntervention(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <img
                    src={item.photoUrl}
                    alt={item.title}
                    className="w-14 h-14 object-cover rounded-lg border border-slate-300 shrink-0 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-mono text-[10px] font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                        {item.id}
                      </span>
                      {item.status === 'Verified' && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified
                        </span>
                      )}
                      {item.status === 'NeedsReview' && (
                        <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <AlertCircle className="w-2.5 h-2.5 text-amber-600" /> Review
                        </span>
                      )}
                      {item.status === 'PriorityInspection' && (
                        <span className="text-[9px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                          <AlertTriangle className="w-2.5 h-2.5 text-rose-600" /> Priority
                        </span>
                      )}
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate mt-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.workType}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-700 truncate">
                    <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span>{item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°</span>
                  </span>
                  <span className="text-slate-400 shrink-0 font-sans text-[9px]">{item.captureDateTime ? item.captureDateTime.split(',')[0] : 'Ground'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Field Specific Data Display */}
      <div className="space-y-6">
        {/* Top: 3-Grid Multi-Spectral Satellite Maps */}
        <MultiMapView
          intervention={selectedIntervention}
          snapshot={selectedSnapshot}
          radius={radius}
        />

        {/* Middle & Bottom: Technical Analysis derived from 3 Maps & Government Recommended Action */}
        <AIEvidencePanel
          intervention={selectedIntervention}
          change={changeAnalysis}
          onConfirmVerification={onVerify}
        />
      </div>
    </div>
  );
};
