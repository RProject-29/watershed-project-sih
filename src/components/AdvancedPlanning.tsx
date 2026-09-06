import React, { useState } from 'react';
import { Compass, Mountain, Droplet, MapPin, CheckCircle, ShieldAlert, Sparkles, Filter } from 'lucide-react';

interface SuitableZone {
  id: string;
  name: string;
  recommendedStructure: string;
  suitabilityScore: number; // 0 - 100
  category: 'High' | 'Medium' | 'Low';
  slopePct: number;
  flowAccumulation: string;
  terrainType: string;
  village: string;
  lat: number;
  lng: number;
  rationale: string;
}

const MOCK_SUITABLE_ZONES: SuitableZone[] = [
  {
    id: 'ZONE-01',
    name: 'Upper Catchment Slope A4',
    recommendedStructure: 'Staggered Contour Trenches & Afforestation',
    suitabilityScore: 92,
    category: 'High',
    slopePct: 18.4,
    flowAccumulation: 'Low (Ridge Line)',
    terrainType: 'Degraded Sloping Land',
    village: 'Ralegan Siddhi North',
    lat: 19.1025,
    lng: 74.4530,
    rationale: 'High slope (>15%) with low vegetation density. Staggered trenches will prevent runoff acceleration and promote soil moisture retention.'
  },
  {
    id: 'ZONE-02',
    name: 'Mid-Stream Confluence B2',
    recommendedStructure: 'Gabion Check Dam / Loose Boulder Structure',
    suitabilityScore: 88,
    category: 'High',
    slopePct: 6.2,
    flowAccumulation: 'High (3rd Order Stream)',
    terrainType: 'Drainage Channel',
    village: 'Hiware Bazar East',
    lat: 19.0882,
    lng: 74.4215,
    rationale: 'High drainage accumulation along 3rd order stream with moderate slope. Ideal for gully plugging and velocity reduction.'
  },
  {
    id: 'ZONE-03',
    name: 'Lower Agricultural Basin C1',
    recommendedStructure: 'Earthen Farm Pond / Dugout Water Structure',
    suitabilityScore: 84,
    category: 'High',
    slopePct: 2.1,
    flowAccumulation: 'Moderate Runoff Sink',
    terrainType: 'Flat Agricultural Basin',
    village: 'Ralegan Siddhi South',
    lat: 19.0740,
    lng: 74.4680,
    rationale: 'Flat terrain (<3% slope) adjacent to agricultural fields. Captures localized runoff for supplementary irrigation during dry spells.'
  },
  {
    id: 'ZONE-04',
    name: 'Slope Ridge Section D3',
    recommendedStructure: 'Continuous Contour Bunding (CCB)',
    suitabilityScore: 65,
    category: 'Medium',
    slopePct: 9.8,
    flowAccumulation: 'Moderate Overland Flow',
    terrainType: 'Moderate Sloping Pasture',
    village: 'Hiware Bazar West',
    lat: 19.0910,
    lng: 74.4050,
    rationale: 'Moderate slope suitable for contour bunding to break overland flow length and prevent topsoil erosion.'
  }
];

export const AdvancedPlanning: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<SuitableZone>(MOCK_SUITABLE_ZONES[0]);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredZones = MOCK_SUITABLE_ZONES.filter(z => 
    filterCategory === 'ALL' || z.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold px-2.5 py-0.5 rounded">
              Spatial Decision-Support Module
            </span>
            <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
              DEM & Hydro Terrain GIS
            </span>
          </div>
          <h2 className="text-xl font-extrabold font-outfit text-white">
            Advanced Watershed Intervention Suitability Planning
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Combines Digital Elevation Models (DEM), slope gradients, and flow accumulation networks to identify high-potential sites for nature-friendly soil and water conservation structures.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs flex items-center gap-3">
          <Filter className="w-4 h-4 text-purple-400" />
          <span>Filter Suitability:</span>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-xs text-white rounded-lg px-2.5 py-1 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="High">High Suitability (&gt;80%)</option>
            <option value="Medium">Medium Suitability (60-80%)</option>
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Suitable Zones List */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Compass className="w-4 h-4 text-purple-600" />
            Identified High-Suitability Zones ({filteredZones.length})
          </h3>

          <div className="space-y-3">
            {filteredZones.map(zone => {
              const isSelected = zone.id === selectedZone.id;
              return (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-purple-500 text-white shadow-lg shadow-purple-950/20'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        zone.category === 'High'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {zone.suitabilityScore}% Suitability ({zone.category})
                    </span>
                    <span className={`text-xs font-mono ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                      {zone.village}
                    </span>
                  </div>

                  <h4 className={`font-bold text-sm mb-1 ${isSelected ? 'text-purple-300' : 'text-slate-900'}`}>
                    {zone.name}
                  </h4>
                  <p className={`text-xs ${isSelected ? 'text-slate-300' : 'text-slate-600'}`}>
                    Proposed: <strong>{zone.recommendedStructure}</strong>
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Zone Detailed Spatial Analysis & Map Preview */}
        <div className="lg:col-span-2 space-y-5">
          {/* Card Details */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="bg-purple-100 text-purple-800 font-bold text-xs px-2.5 py-1 rounded-full border border-purple-200">
                  {selectedZone.id} — Candidate Site
                </span>
                <h3 className="text-lg font-bold text-slate-900 font-outfit mt-1">
                  {selectedZone.name}
                </h3>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-purple-700 font-outfit">
                  {selectedZone.suitabilityScore}%
                </div>
                <div className="text-[11px] text-slate-500 font-medium">GIS Suitability Score</div>
              </div>
            </div>

            {/* Terrain Parameter Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <Mountain className="w-4 h-4 text-purple-600" />
                  <span>Slope Gradient</span>
                </div>
                <div className="text-base font-bold text-slate-800 font-mono">
                  {selectedZone.slopePct}% Slope
                </div>
                <div className="text-[10px] text-slate-500">From DEM 30m Elevation</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <Droplet className="w-4 h-4 text-blue-600" />
                  <span>Flow Accumulation</span>
                </div>
                <div className="text-xs font-bold text-slate-800">
                  {selectedZone.flowAccumulation}
                </div>
                <div className="text-[10px] text-slate-500">Hydro Runoff Network</div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Coordinates</span>
                </div>
                <div className="text-xs font-mono font-bold text-slate-800">
                  {selectedZone.lat.toFixed(4)}°, {selectedZone.lng.toFixed(4)}°
                </div>
                <div className="text-[10px] text-slate-500">WGS84 Datum</div>
              </div>
            </div>

            {/* Nature-Friendly Recommended Measure */}
            <div className="bg-purple-950/10 border border-purple-200 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>Recommended Nature-Friendly Intervention: {selectedZone.recommendedStructure}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Geospatial Rationale:</strong> {selectedZone.rationale}
              </p>
            </div>

            {/* Government Cautionary Warning */}
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800 flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Decision-Support Advisory:</strong> Spatial suitability is an indicative planning guide. Ground-level technical survey and officer field inspection are mandatory prior to any physical construction.
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-2 flex justify-end">
              <button className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 cursor-pointer">
                <CheckCircle className="w-4 h-4" />
                <span>Assign Field Survey for Verification</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
