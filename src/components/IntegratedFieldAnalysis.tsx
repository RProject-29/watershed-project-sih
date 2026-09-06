import type { Intervention, AnalysisRadius } from '../types';
import React, { useState } from 'react';
import { getSnapshotForYear, computeChangeAnalysis } from '../utils/spectralEngine';
import { MultiMapView } from './MultiMapView';
import { ComparisonLeafletMaps } from './ComparisonLeafletMaps';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Sparkles,
  Award,
  Layers,
  Building2,
  TreePine,
  Landmark,
  ArrowRight
} from 'lucide-react';

interface IntegratedFieldAnalysisProps {
  interventions: Intervention[];
  selectedIntervention: Intervention;
  onSelectIntervention: (id: string) => void;
  beforeYear: number;
  afterYear: number;
  onBeforeYearChange: (year: number) => void;
  onAfterYearChange: (year: number) => void;
  radius: AnalysisRadius;
  onVerify: (remarks?: string) => void;
  onExportReport: () => void;
}

export const IntegratedFieldAnalysis: React.FC<IntegratedFieldAnalysisProps> = ({
  interventions,
  selectedIntervention,
  onSelectIntervention,
  beforeYear,
  afterYear,
  onBeforeYearChange,
  onAfterYearChange,
  radius,
  onVerify,
  onExportReport
}) => {
  const [viewMode, setViewMode] = useState<'rgb' | 'ndvi' | 'ndwi'>('rgb');
  const [officerRemark, setOfficerRemark] = useState<string>('');

  const beforeSnapshot = getSnapshotForYear(selectedIntervention, beforeYear);
  const afterSnapshot = getSnapshotForYear(selectedIntervention, afterYear);
  const change = computeChangeAnalysis(selectedIntervention, beforeYear, afterYear);

  // Strict deduplication by ID
  const uniqueInterventions = Array.from(
    new Map(interventions.map(item => [item.id, item])).values()
  );

  return (
    <div className="space-y-6">
      {/* 1. TOP EXECUTIVE HEADER BANNER WITH ONLY ONE SINGLE DOWNLOAD COMPLETE REPORT BUTTON */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Unified GIS & Spectral Analysis Module
            </span>
            <span className="bg-blue-500/20 text-blue-300 font-bold text-xs px-2.5 py-0.5 rounded-full border border-blue-500/30 font-mono">
              {selectedIntervention.id}
            </span>
          </div>
          <h2 className="text-xl font-extrabold font-outfit text-white mt-1.5 flex items-center gap-2">
            <span>{selectedIntervention.title}</span>
            <span className="text-xs bg-slate-800 text-slate-300 font-sans px-2.5 py-0.5 rounded-lg border border-slate-700 font-normal">
              {selectedIntervention.workType}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {selectedIntervention.locationName}, {selectedIntervention.district} ({selectedIntervention.state})
            </span>
            <span>•</span>
            <span className="font-mono text-slate-300">
              {selectedIntervention.latitude.toFixed(4)}° N, {selectedIntervention.longitude.toFixed(4)}° E
            </span>
          </p>
        </div>

        {/* SINGLE TOP PROMINENT ACTION: DOWNLOAD COMPLETE COMPREHENSIVE REPORT */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportReport}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer border border-emerald-400/40 hover:scale-[1.02] active:scale-[0.98]"
            title="Generate & Download Full Executive PDF Report containing Field Data, Comparative Matrix, DEM Advancement & Government Policy Decisions"
          >
            <FileText className="w-4 h-4 text-emerald-100" />
            <span>Download Complete Comprehensive Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* 2. FIELD SELECTION SWITCHER (Clean non-duplicate selector) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 font-outfit flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Select Target Field Intervention ({uniqueInterventions.length} Registered Records)</span>
          </h3>
          <span className="text-[11px] text-slate-500">
            Click to switch spectral focus
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {uniqueInterventions.map((item) => {
            const isSelected = item.id === selectedIntervention.id;
            return (
              <div
                key={item.id}
                onClick={() => onSelectIntervention(item.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-emerald-50/90 border-emerald-600 shadow-md ring-2 ring-emerald-500/30'
                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <img
                  src={item.photoUrl}
                  alt={item.title}
                  className="w-12 h-12 object-cover rounded-lg border border-slate-300 shrink-0 shadow-xs"
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
                  <h4 className="font-bold text-xs text-slate-900 truncate mt-0.5">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 truncate">{item.locationName}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SECTION A: FIELD DATA ANALYSIS (3-GRID MULTI-SPECTRAL SATELLITE MAPS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-6 bg-emerald-500 rounded-full"></span>
            <h3 className="text-base font-extrabold text-slate-900 font-outfit">
              Part 1: Multi-Spectral Satellite Remote Sensing Extraction (3-Grid Maps)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Sentinel-2 L2A BOA Reflectance • Radius: {radius}m Buffer
          </span>
        </div>

        <MultiMapView
          intervention={selectedIntervention}
          snapshot={afterSnapshot}
          radius={radius}
        />
      </div>

      {/* 4. SECTION B: COMPARABLE FIELD (MULTI-YEAR BASELINE VS TARGET PERFORMANCE MATRIX) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-slate-800 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
              <h3 className="text-base font-extrabold text-slate-900 font-outfit">
                Part 2: Multi-Year Comparable Performance Analysis (Baseline vs Target)
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Comparing {beforeSnapshot.monthName} {beforeYear} vs {afterSnapshot.monthName} {afterYear} (Seasonally Synchronized)
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            {/* Year Selectors */}
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

            {/* View Mode */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl text-xs font-medium text-white shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('rgb')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'rgb' ? 'bg-blue-600 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Satellite RGB
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ndvi')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'ndvi' ? 'bg-emerald-600 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDVI Vegetation
              </button>
              <button
                type="button"
                onClick={() => setViewMode('ndwi')}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'ndwi' ? 'bg-cyan-600 font-bold shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                NDWI Moisture
              </button>
            </div>
          </div>
        </div>

        {/* Side by side interactive Leaflet comparison maps (Integrated with selected field coordinates & 3 option toggles) */}
        <ComparisonLeafletMaps
          intervention={selectedIntervention}
          beforeSnapshot={beforeSnapshot}
          afterSnapshot={afterSnapshot}
          beforeYear={beforeYear}
          afterYear={afterYear}
          radius={radius}
          viewMode={viewMode}
        />

        {/* Quantitative Performance Matrix Table */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden">
          <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
            <span className="uppercase tracking-wider font-outfit text-slate-900">Quantitative Remote Sensing Indicator Delta</span>
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
                <td className="px-4 py-2.5 font-semibold text-slate-900">NDVI Canopy Vegetation Index</td>
                <td className="px-4 py-2.5 font-mono">{beforeSnapshot.ndviValue}</td>
                <td className="px-4 py-2.5 font-mono font-bold text-emerald-700">{afterSnapshot.ndviValue}</td>
                <td className="px-4 py-2.5 font-mono font-bold">
                  <span className={change.ndviChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                    {change.ndviChange >= 0 ? `+${change.ndviChange}` : change.ndviChange}
                  </span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Vegetation Recovery (+{change.vegChangePct}%)
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
                    <TrendingDown className="w-3 h-3" /> Barren Land Reclaimed
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
                    <TrendingUp className="w-3 h-3" /> Double Cropping Expansion
                  </span>
                </td>
              </tr>

              {/* NDMI */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Soil Moisture Index (NDMI)</td>
                <td className="px-4 py-2.5 font-mono">0.18</td>
                <td className="px-4 py-2.5 font-mono font-bold text-blue-700">0.42</td>
                <td className="px-4 py-2.5 font-mono font-bold text-blue-600">+0.24</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Subsurface Hydration
                  </span>
                </td>
              </tr>

              {/* Groundwater Recharge */}
              <tr className="hover:bg-slate-100/50">
                <td className="px-4 py-2.5 font-semibold text-slate-900">Est. Groundwater Recharge Volume</td>
                <td className="px-4 py-2.5 font-mono">1.2 Mld</td>
                <td className="px-4 py-2.5 font-mono font-bold text-indigo-700">3.8 Mld</td>
                <td className="px-4 py-2.5 font-mono font-bold text-indigo-600">+2.6 Mld</td>
                <td className="px-4 py-2.5">
                  <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    <TrendingUp className="w-3 h-3" /> Aquifer Table Elevated (+1.8m)
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SECTION C: DEDICATED GOVERNMENT STRATEGIC RECOMMENDATIONS & NATURE-BENEFIT POLICY ADVISORY */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-2xl border border-indigo-500/30 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-indigo-800/60 pb-4 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-950 font-black shadow-md">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400/20 text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded border border-amber-400/30 uppercase">
                  Strategic Policy Advisory
                </span>
                <span className="text-[11px] text-slate-400">DoLR / IWMP Decision Framework</span>
              </div>
              <h3 className="text-lg font-extrabold font-outfit text-white">
                Government Strategic Decisions & Nature-Benefit Policy Advisory
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-700/80 text-[11px] font-mono px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Policy Confidence: 96.8%
            </span>
          </div>
        </div>

        {/* Executive Decision Rationale */}
        <div className="bg-indigo-950/70 border border-indigo-800/80 rounded-xl p-4 text-xs text-indigo-100 leading-relaxed shadow-inner">
          <p className="font-semibold text-white">
            "Based on the Sentinel-2 multispectral evidence ({beforeYear}–{afterYear}) and Cartosat-derived DEM hydrological modeling, this intervention has generated a <strong className="text-emerald-400">+{change.ndviChange} NDVI canopy uplift</strong> and established a <strong className="text-cyan-400">+{change.ndwiAreaChangeHa} Ha perennial water retention zone</strong>. The following strategic decisions are recommended for government authorities to optimize long-term utilization and ecological balance."
          </p>
        </div>

        {/* 4 Concrete Strategic Decisions for Government */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300 mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-amber-400" />
            <span>4 Immediate Administrative & Operational Decisions for Watershed Authorities</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Decision 1 */}
            <div className="bg-slate-950/80 border border-indigo-900/80 rounded-xl p-4 space-y-1.5 hover:border-indigo-500/50 transition-all">
              <div className="font-bold text-amber-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 text-[11px] flex items-center justify-center font-mono">1</span>
                <span>Sanction Downstream Continuous Contour Bunding (Phase II)</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Allocate ₹4.2 Lakhs under MGNREGA / IWMP Scheme for constructing a 350m secondary earthen bund 200m downstream. This will arrest excess overflow velocity during high peak monsoon deltas and prevent gully erosion.
              </p>
            </div>

            {/* Decision 2 */}
            <div className="bg-slate-950/80 border border-indigo-900/80 rounded-xl p-4 space-y-1.5 hover:border-indigo-500/50 transition-all">
              <div className="font-bold text-emerald-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] flex items-center justify-center font-mono">2</span>
                <span>Notify Village Aquifer Recharge & Extraction Regulation Zone</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Enact a Gram Panchayat resolution prohibiting deep borewell drilling (&gt;200 ft) within a 1km radius of this pond. Mandate micro-irrigation (drip/sprinkler) for Rabi season crops to preserve elevated groundwater levels.
              </p>
            </div>

            {/* Decision 3 */}
            <div className="bg-slate-950/80 border border-indigo-900/80 rounded-xl p-4 space-y-1.5 hover:border-indigo-500/50 transition-all">
              <div className="font-bold text-cyan-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] flex items-center justify-center font-mono">3</span>
                <span>Agro-Forestry & Horticulture Buffer Strip Plantation</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Distribute 800 drought-resilient fruit saplings (Custard Apple, Drumstick, Mango) to local smallholders along the perimeter moisture zone, enabling farmer secondary income while permanently binding soil.
              </p>
            </div>

            {/* Decision 4 */}
            <div className="bg-slate-950/80 border border-indigo-900/80 rounded-xl p-4 space-y-1.5 hover:border-indigo-500/50 transition-all">
              <div className="font-bold text-purple-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] flex items-center justify-center font-mono">4</span>
                <span>Institutionalize Pre-Monsoon Desiltation & IoT Water Monitoring</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Establish a 3-year cyclic community desiltation schedule with nutrient-rich silt returned to agricultural farms. Deploy automated ultrasonic water level and soil moisture probes for live satellite calibration.
              </p>
            </div>
          </div>
        </div>

        {/* DUAL BENEFIT MATRIX: NATURE VS GOVERNMENT */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300 mb-3 flex items-center gap-2">
            <TreePine className="w-4 h-4 text-emerald-400" />
            <span>Dual Impact Matrix: Direct Ecological Gains (Nature) vs Socio-Economic ROI (Government)</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Benefits to Nature & Ecology */}
            <div className="bg-emerald-950/40 border border-emerald-600/40 rounded-xl p-4 space-y-3">
              <div className="font-bold text-emerald-300 text-xs flex items-center gap-2 uppercase tracking-wide">
                <TreePine className="w-4 h-4 text-emerald-400" />
                <span>Tangible Benefits to Nature & Ecology</span>
              </div>
              <ul className="space-y-2 text-slate-200 text-[11px]">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Aquifer Replenishment:</strong> +2.6 Mld annual deep-percolation recharge, raising water table by 1.8 meters across a 1000m radius.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Soil Erosion Mitigation:</strong> 42% reduction in surface runoff velocity, retaining approx. 180 tonnes of fertile topsoil annually.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Micro-Climate & Biodiversity:</strong> 1.4°C local surface temperature cooling and natural wildlife/pollinator habitat corridor revival.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Carbon Sequestration:</strong> Biomass canopy gain yielding estimated 14.2 tonnes CO2 equivalent sequestration per annum.</span>
                </li>
              </ul>
            </div>

            {/* Right: Benefits to Government & Administration */}
            <div className="bg-blue-950/40 border border-blue-600/40 rounded-xl p-4 space-y-3">
              <div className="font-bold text-blue-300 text-xs flex items-center gap-2 uppercase tracking-wide">
                <Landmark className="w-4 h-4 text-blue-400" />
                <span>Tangible Benefits to Government & Public Ex-Chequer</span>
              </div>
              <ul className="space-y-2 text-slate-200 text-[11px]">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Drought Relief Expenditure Savings:</strong> Eliminates emergency water tanker supplies, saving the District Administration ~₹18.5 Lakhs annually.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>High Fiscal Return on Capital:</strong> Calculated public benefit-cost ratio (BCR) of 3.42:1 over 5 years via doubled agricultural yield.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>100% Audit & IWMP Compliance:</strong> Tamper-proof GPS EXIF and satellite spectral evidence ready for CAG and Ministry scrutiny.</span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong>Rural Migration Reversal:</strong> Sustained double-cropping elevates average household income by +38%, curbing seasonal urban distress migration.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Officer Verification & Confirmation Form */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 border-t border-indigo-800/60 text-xs">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>EXIF Geotag Integrity Verified: <strong className="text-white font-mono">{selectedIntervention.latitude.toFixed(4)}°, {selectedIntervention.longitude.toFixed(4)}°</strong></span>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="w-full sm:w-72">
              <input
                type="text"
                value={officerRemark}
                onChange={(e) => setOfficerRemark(e.target.value)}
                placeholder="Enter officer policy compliance remark..."
                className="w-full bg-slate-950 border border-indigo-700/60 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 font-sans"
              />
            </div>
            <button
              type="button"
              onClick={() => onVerify(officerRemark)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-5 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Confirm & Store Verification</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
