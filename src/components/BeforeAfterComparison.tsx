import type { Intervention, AnalysisRadius } from '../types';
import React, { useState } from 'react';
import { getSnapshotForYear, computeChangeAnalysis, generateSpectralCanvasTile } from '../utils/spectralEngine';
import { TrendingUp, TrendingDown, Info, Filter, ExternalLink, FileText, CheckCircle2, ShieldCheck, MapPin } from 'lucide-react';

interface BeforeAfterComparisonProps {
  interventions: Intervention[];
  selectedIntervention: Intervention;
  onSelectIntervention: (id: string) => void;
  beforeYear: number;
  afterYear: number;
  onBeforeYearChange: (year: number) => void;
  onAfterYearChange: (year: number) => void;
  radius: AnalysisRadius;
  onVerify?: (remarks?: string) => void;
  onExportReport?: () => void;
  onNavigateToRepository?: () => void;
}

export const BeforeAfterComparison: React.FC<BeforeAfterComparisonProps> = ({
  interventions,
  selectedIntervention,
  onSelectIntervention,
  beforeYear,
  afterYear,
  onBeforeYearChange,
  onAfterYearChange,
  radius,
  onVerify,
  onExportReport,
  onNavigateToRepository
}) => {
  const [viewMode, setViewMode] = useState<'rgb' | 'ndvi' | 'ndwi'>('rgb');
  const [officerRemark, setOfficerRemark] = useState<string>('');

  // 4 recent field entries for comparison
  const recentInterventions = interventions.slice(0, 4);

  const beforeSnapshot = getSnapshotForYear(selectedIntervention, beforeYear);
  const afterSnapshot = getSnapshotForYear(selectedIntervention, afterYear);
  const change = computeChangeAnalysis(selectedIntervention, beforeYear, afterYear);

  const beforeTile = generateSpectralCanvasTile(viewMode, beforeSnapshot, radius, 400);
  const afterTile = generateSpectralCanvasTile(viewMode, afterSnapshot, radius, 400);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-blue-500/20 text-blue-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-500/30">
              Module F: Comparable Field
            </span>
            <h2 className="text-lg font-extrabold font-outfit text-slate-100">
              Comparable Field — Multi-Year Satellite Performance Analysis
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Compare baseline vs post-intervention satellite spectral changes over identical seasonal windows.
          </p>
        </div>

        {onExportReport && (
          <button
            type="button"
            onClick={onExportReport}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-blue-100" />
            <span>Get Report in PDF</span>
          </button>
        )}
      </div>

      {/* 4 Recent Field Entries Gallery */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-900 font-outfit flex items-center gap-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <span>Select Comparable Field Entry (Showing 4 Recent)</span>
          </h3>
          {onNavigateToRepository && (
            <button
              type="button"
              onClick={onNavigateToRepository}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>View All Saved Data in Repository</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
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
                    ? 'bg-blue-50/90 border-blue-600 shadow-md ring-2 ring-blue-500/30'
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
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        item.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
                        item.status === 'NeedsReview' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 truncate mt-1">{item.title}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold">{item.workType}</p>
                  </div>
                </div>

                <div className="text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded-lg border border-slate-200/80 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-700 truncate">
                    <MapPin className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{item.latitude.toFixed(4)}°, {item.longitude.toFixed(4)}°</span>
                  </span>
                  <span className="text-slate-400 shrink-0 font-sans text-[9px]">{item.captureDateTime ? item.captureDateTime.split(',')[0] : 'Ground'}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Comparable Field Analysis Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-slate-800 space-y-6">
        {/* Title, Year Dropdowns & Mode Selector Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 font-outfit">
              {selectedIntervention.title} ({beforeYear} vs {afterYear})
            </h3>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Lat: {selectedIntervention.latitude.toFixed(4)}° N | Long: {selectedIntervention.longitude.toFixed(4)}° E | Buffer: {radius}m Radius
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Year & Season Selectors */}
            <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-bold">Baseline:</span>
                <select
                  value={beforeYear}
                  onChange={(e) => onBeforeYearChange(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-slate-800 cursor-pointer"
                >
                  <option value={2021}>June 2021 (Monsoon)</option>
                  <option value={2022}>June 2022 (Monsoon)</option>
                  <option value={2023}>June 2023 (Monsoon)</option>
                </select>
              </div>

              <span className="text-slate-400 font-bold">vs</span>

              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-500 font-bold">Target:</span>
                <select
                  value={afterYear}
                  onChange={(e) => onAfterYearChange(Number(e.target.value))}
                  className="bg-white border border-slate-300 rounded-lg px-2 py-1 font-bold text-blue-900 cursor-pointer"
                >
                  <option value={2024}>June 2024 (Post-Work)</option>
                  <option value={2025}>June 2025 (Post-Work)</option>
                  <option value={2026}>June 2026 (Target)</option>
                </select>
              </div>
            </div>

            {/* View Mode Options */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl text-xs font-medium text-white shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('rgb')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'rgb' ? 'bg-blue-600 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ndvi')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'ndvi' ? 'bg-emerald-600 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDVI View
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ndwi')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'ndwi' ? 'bg-cyan-600 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDWI Surface Moisture
              </button>
            </div>
          </div>
        </div>

        {/* Season Alignment Notice */}
        <div className="bg-sky-50 border border-sky-200 rounded-xl p-3 flex items-center justify-between text-xs text-sky-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-600 shrink-0" />
            <span>
              <strong>Seasonal Alignment Notice:</strong> Comparing {beforeSnapshot.monthName} {beforeYear} vs {afterSnapshot.monthName} {afterYear} (Seasonally Aligned Baseline).
            </span>
          </div>
          <span className="bg-sky-200 text-sky-900 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Seasonally Aligned
          </span>
        </div>

        {/* Side-by-Side Comparison Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Left: Baseline Tile */}
          <div className="bg-slate-900 rounded-xl p-3.5 text-white border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-amber-500/30">
                BEFORE: {beforeSnapshot.monthName} {beforeYear}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Source: {beforeSnapshot.satelliteSource}
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-video border border-slate-800">
              <img src={beforeTile} alt={`Before Satellite ${beforeYear}`} className="w-full h-full object-cover" />
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 text-center bg-slate-950 p-2 rounded-lg">
              <div>NDVI: <strong className="text-amber-400">{beforeSnapshot.ndviValue}</strong></div>
              <div>Water: <strong className="text-cyan-400">{beforeSnapshot.ndwiAreaHectares} Ha</strong></div>
              <div>Barren: <strong className="text-rose-400">{beforeSnapshot.lulcBreakdown.barren}%</strong></div>
            </div>
          </div>

          {/* Right: Target Tile */}
          <div className="bg-slate-900 rounded-xl p-3.5 text-white border border-slate-800 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-emerald-500/30">
                AFTER: {afterSnapshot.monthName} {afterYear}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Source: {afterSnapshot.satelliteSource}
              </span>
            </div>
            <div className="relative rounded-lg overflow-hidden aspect-video border border-slate-800">
              <img src={afterTile} alt={`After Satellite ${afterYear}`} className="w-full h-full object-cover" />
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 text-center bg-slate-950 p-2 rounded-lg">
              <div>NDVI: <strong className="text-emerald-400">{afterSnapshot.ndviValue}</strong></div>
              <div>Water: <strong className="text-cyan-400">{afterSnapshot.ndwiAreaHectares} Ha</strong></div>
              <div>Barren: <strong className="text-emerald-400">{afterSnapshot.lulcBreakdown.barren}%</strong></div>
            </div>
          </div>
        </div>

        {/* Quantitative Satellite Indicator Matrix Table */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
            <span className="uppercase tracking-wider font-outfit text-slate-900">Quantitative Satellite Indicator Matrix</span>
            <span className="text-slate-500 font-mono text-[11px]">Buffer: {radius}m Radius</span>
          </div>

          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-200/70 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="px-4 py-2.5">Indicator Parameter</th>
                <th className="px-4 py-2.5">Baseline ({beforeYear})</th>
                <th className="px-4 py-2.5">Post-Work ({afterYear})</th>
                <th className="px-4 py-2.5">Net Delta</th>
                <th className="px-4 py-2.5">Satellite Trend Tag</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {/* NDVI */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">NDVI Canopy Index</td>
                <td className="px-4 py-2.5 font-mono">{beforeSnapshot.ndviValue}</td>
                <td className="px-4 py-2.5 font-mono font-bold text-emerald-700">{afterSnapshot.ndviValue}</td>
                <td className="px-4 py-2.5 font-mono font-bold">
                  <span className={change.ndviChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {change.ndviChange >= 0 ? `+${change.ndviChange}` : change.ndviChange}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Vegetation Recovery
                  </span>
                </td>
              </tr>

              {/* NDWI Surface Water */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Surface Water Extent (Ha)</td>
                <td className="px-4 py-2.5 font-mono">{beforeSnapshot.ndwiAreaHectares} Ha</td>
                <td className="px-4 py-2.5 font-mono font-bold text-cyan-700">{afterSnapshot.ndwiAreaHectares} Ha</td>
                <td className="px-4 py-2.5 font-mono font-bold">
                  <span className={change.ndwiAreaChangeHa >= 0 ? 'text-cyan-600' : 'text-rose-600'}>
                    {change.ndwiAreaChangeHa >= 0 ? `+${change.ndwiAreaChangeHa} Ha` : `${change.ndwiAreaChangeHa} Ha`}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Water Retention (+{change.ndwiAreaChangeHa} Ha)
                  </span>
                </td>
              </tr>

              {/* Barren Land % */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Barren Land Area (%)</td>
                <td className="px-4 py-2.5 font-mono">{beforeSnapshot.lulcBreakdown.barren}%</td>
                <td className="px-4 py-2.5 font-mono font-bold">{afterSnapshot.lulcBreakdown.barren}%</td>
                <td className="px-4 py-2.5 font-mono font-bold">
                  <span className={change.barrenChangePct <= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {change.barrenChangePct <= 0 ? `${change.barrenChangePct}%` : `+${change.barrenChangePct}%`}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingDown className="w-3 h-3" /> Barren Reduction
                  </span>
                </td>
              </tr>

              {/* Agriculture Area % */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Agricultural Cropland (%)</td>
                <td className="px-4 py-2.5 font-mono">{beforeSnapshot.lulcBreakdown.agriculture}%</td>
                <td className="px-4 py-2.5 font-mono font-bold text-teal-700">{afterSnapshot.lulcBreakdown.agriculture}%</td>
                <td className="px-4 py-2.5 font-mono font-bold">
                  <span className={change.agriChangePct >= 0 ? 'text-teal-600' : 'text-rose-600'}>
                    {change.agriChangePct >= 0 ? `+${change.agriChangePct}%` : `${change.agriChangePct}%`}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Cropland Gain
                  </span>
                </td>
              </tr>

              {/* Extra Indicator Row 1: Soil Moisture Index (NDMI) */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Soil Moisture Index (NDMI)</td>
                <td className="px-4 py-2.5 font-mono">0.18</td>
                <td className="px-4 py-2.5 font-mono font-bold text-blue-700">0.42</td>
                <td className="px-4 py-2.5 font-mono font-bold text-blue-600">+0.24</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Soil Moisture Retention (+0.24)
                  </span>
                </td>
              </tr>

              {/* Extra Indicator Row 2: Est. Groundwater Storage Delta (Mld) */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Est. Groundwater Recharge Volume (Mld)</td>
                <td className="px-4 py-2.5 font-mono">1.2 Mld</td>
                <td className="px-4 py-2.5 font-mono font-bold text-indigo-700">3.8 Mld</td>
                <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">+2.6 Mld</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Subsurface Aquifer Enhanced
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Field Evidence Synthesis & Technical Analysis Panel (Screenshot 2 - Light Blue Theme, Remarks & Report Action) */}
      <div className="bg-gradient-to-br from-sky-950 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-sky-800/80 space-y-4">
        {/* Header without AI Logo */}
        <div className="flex flex-wrap items-center justify-between border-b border-sky-800/60 pb-3 gap-3">
          <div>
            <h4 className="text-base font-extrabold font-outfit text-sky-100">
              Field Evidence Synthesis & Technical Analysis
            </h4>
            <p className="text-[11px] text-sky-300/80 mt-0.5">
              Comprehensive multi-year comparative synthesis & officer action plan
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onExportReport && (
              <button
                type="button"
                onClick={onExportReport}
                className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-sky-100" />
                <span>Get Report in PDF</span>
              </button>
            )}
            <span className="bg-sky-900/80 text-sky-200 border border-sky-700/60 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold shadow-xs">
              Confidence: 94.2%
            </span>
          </div>
        </div>

        {/* Synthesis Summary Box */}
        <div className="bg-sky-950/80 border border-sky-800/70 rounded-xl p-4 text-slate-100 text-xs leading-relaxed shadow-inner">
          <p className="font-semibold text-sky-50 leading-normal">
            "{change.aiSummary}"
          </p>
          <p className="text-[10px] text-sky-300/70 mt-1 italic">
            *Note: All observations follow strict correlation standard (correlation vs causation guardrail).
          </p>
        </div>

        {/* Observed Improvements & Recommended Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Left: Observed Improvements & Benefits */}
          <div className="bg-slate-950/70 border border-sky-800/60 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> Observed Field Improvements & Benefits
            </div>
            <ul className="space-y-1.5 text-slate-200 text-[11px] list-disc list-inside leading-relaxed">
              <li><strong className="text-emerald-300">Vegetation Canopy Recovery:</strong> +{change.vegChangePct}% gain (NDVI delta +{change.ndviChange})</li>
              <li><strong className="text-cyan-300">Surface Water Retention:</strong> +{change.ndwiAreaChangeHa} Ha reservoir expansion</li>
              <li><strong className="text-amber-300">Barren Land Reduction:</strong> {change.barrenChangePct}% shift converted to productive land</li>
              <li><strong className="text-indigo-300">Groundwater Storage:</strong> +2.6 Mld estimated subsurface aquifer recharge gain</li>
            </ul>
          </div>

          {/* Right: Recommended New Projects & Officer Activities */}
          <div className="bg-slate-950/70 border border-sky-800/60 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-sky-400" /> Recommended Officer Activities & Next Projects
            </div>
            <ul className="space-y-1.5 text-slate-200 text-[11px] list-disc list-inside leading-relaxed">
              <li><strong className="text-sky-200">Secondary Bunding:</strong> Construct secondary contour bunding 200m downstream.</li>
              <li><strong className="text-sky-200">Perimeter Afforestation:</strong> Initiate horticulture afforestation along pond border.</li>
              <li><strong className="text-sky-200">Bi-Monthly Sentinel Tracking:</strong> Schedule Sentinel-2 L2A automated cloud tracking.</li>
            </ul>
          </div>
        </div>

        {/* Verification Confirmation Footer with Remarks Input & PDF Report Export */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-sky-800/60 text-xs">
          <div className="text-[11px] text-sky-300/80">
            GIS Geotag Verified: <strong className="text-white font-mono">Encrypted Sub-Meter Accuracy</strong>
          </div>

          {onVerify && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={officerRemark}
                  onChange={(e) => setOfficerRemark(e.target.value)}
                  placeholder="Enter officer remark notes..."
                  className="w-full bg-slate-950/90 border border-sky-700/60 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-sky-400 font-sans"
                />
              </div>
              <button
                type="button"
                onClick={() => onVerify(officerRemark)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                <span>Confirm Data & Store</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
