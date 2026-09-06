import React, { useState } from 'react';
import type { Intervention } from '../types';
import { Database, Image, Globe, Layers, Download, FileText, CheckCircle2 } from 'lucide-react';
import { storageService } from '../utils/storageService';

interface DataRepositoryProps {
  interventions?: Intervention[];
}

export const DataRepository: React.FC<DataRepositoryProps> = ({ interventions: propInterventions }) => {
  const [activeSubTab, setActiveSubTab] = useState<'Field' | 'Satellite' | 'GIS' | 'Analysis'>('Field');
  const interventions = propInterventions || storageService.loadInterventions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded">
              PostgreSQL + PostGIS Data Repository
            </span>
            <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded text-slate-300">
              Audit-Adherent Archive
            </span>
          </div>
          <h2 className="text-xl font-extrabold font-outfit text-white">
            Central Watershed Data & GIS Asset Repository
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Stores ground-level EXIF field photographs, satellite raster observations, spatial vector layers, and computed environmental spectral indices.
          </p>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer">
          <Download className="w-4 h-4" />
          <span>Export Full GeoPackage / CSV</span>
        </button>
      </div>

      {/* Sub-Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('Field')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'Field'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Image className="w-4 h-4 text-emerald-400" />
          <span>Field Evidence Photos (EXIF) ({interventions.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('Satellite')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'Satellite'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Globe className="w-4 h-4 text-teal-400" />
          <span>Satellite Rasters (Sentinel-2)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('GIS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'GIS'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>GIS Vector Layers (WMS)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('Analysis')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'Analysis'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Analytical Metric Records</span>
        </button>
      </div>

      {/* Content Panels */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-md p-6">
        {activeSubTab === 'Field' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-600" />
              Field Evidence Archive (EXIF-Parsed Ground Photos)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 border-collapse">
                <thead className="bg-slate-100 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Intervention ID</th>
                    <th className="p-3">Work Title & Type</th>
                    <th className="p-3">GPS Coordinates</th>
                    <th className="p-3">Capture Date & Time</th>
                    <th className="p-3">EXIF Integrity</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {interventions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="p-3 font-mono font-bold text-slate-900">{item.id}</td>
                      <td className="p-3">
                        <div className="font-semibold text-slate-800">{item.title}</div>
                        <div className="text-[10px] text-slate-500">{item.workType}</div>
                      </td>
                      <td className="p-3 font-mono text-[11px]">{item.latitude.toFixed(4)}° N, {item.longitude.toFixed(4)}° E</td>
                      <td className="p-3">{item.captureDateTime}</td>
                      <td className="p-3">
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200">
                          EXIF GPS Verified
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-emerald-600 hover:text-emerald-800 font-semibold cursor-pointer">Download Photo</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'Satellite' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" />
              Satellite Observation Catalog (Sentinel-2 L2A BOA Multispectral)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-700 border-collapse">
                <thead className="bg-slate-100 uppercase text-[10px] text-slate-500 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Satellite / Sensor</th>
                    <th className="p-3">Acquisition Date</th>
                    <th className="p-3">Spatial Resolution</th>
                    <th className="p-3">Cloud Coverage</th>
                    <th className="p-3">Bands Processed</th>
                    <th className="p-3 text-right">Download GeoTIFF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Sentinel-2B MSI</td>
                    <td className="p-3">2026-02-15</td>
                    <td className="p-3 font-mono">10m / pixel</td>
                    <td className="p-3 font-mono text-emerald-700">1.2% (Clear)</td>
                    <td className="p-3 font-mono">B02, B03, B04, B08, B11</td>
                    <td className="p-3 text-right">
                      <button className="text-teal-600 hover:text-teal-800 font-semibold">Export Raster (.tif)</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Sentinel-2A MSI (Baseline)</td>
                    <td className="p-3">2021-02-10</td>
                    <td className="p-3 font-mono">10m / pixel</td>
                    <td className="p-3 font-mono text-emerald-700">2.5% (Clear)</td>
                    <td className="p-3 font-mono">B02, B03, B04, B08, B11</td>
                    <td className="p-3 text-right">
                      <button className="text-teal-600 hover:text-teal-800 font-semibold">Export Baseline (.tif)</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSubTab === 'GIS' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-600" />
              Official WMS / Vector GIS Spatial Layers
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-xs text-slate-900 mb-1">IWMP Watershed Boundary</div>
                <div className="text-[11px] text-slate-500 mb-2">Source: Bhuvan NRSC ISRO | CRS: EPSG:4326</div>
                <button className="text-xs text-purple-700 hover:underline font-bold">Download GeoJSON</button>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="font-bold text-xs text-slate-900 mb-1">Drainage Network & Stream Orders</div>
                <div className="text-[11px] text-slate-500 mb-2">Source: DEM Derived Hydro Vector | LineString</div>
                <button className="text-xs text-purple-700 hover:underline font-bold">Download GeoJSON</button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'Analysis' && (
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              Computed Environmental Indicators Dataset
            </h3>
            <p className="text-xs text-slate-600">
              CSV dataset contains all calculated NDVI, NDWI, Water Surface Extent ($m^2$), and LULC breakdown records from 2021 to 2026.
            </p>
            <button className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Download Complete Metrics CSV Dataset</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
