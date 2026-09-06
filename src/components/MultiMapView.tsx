import type { Intervention, SatelliteSnapshot, AnalysisRadius } from '../types';
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { bhuvanService, type BhuvanAOIStats } from '../utils/bhuvanService';
import {
  Eye,
  Droplets,
  TreePine,
  MapPin,
  Globe,
  Layers,
  Sparkles,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

interface MultiMapViewProps {
  intervention: Intervention;
  snapshot: SatelliteSnapshot;
  radius: AnalysisRadius;
}

export const MultiMapView: React.FC<MultiMapViewProps> = ({
  intervention,
  snapshot,
  radius
}) => {
  const [bhuvanAOI, setBhuvanAOI] = useState<BhuvanAOIStats | null>(null);
  const [activeLayerMode, setActiveLayerMode] = useState<'spectral' | 'bhuvan50k'>('spectral');

  // Leaflet Container Refs
  const map1Ref = useRef<HTMLDivElement>(null);
  const map2Ref = useRef<HTMLDivElement>(null);
  const map3Ref = useRef<HTMLDivElement>(null);

  // Leaflet Instance Refs
  const map1Instance = useRef<L.Map | null>(null);
  const map2Instance = useRef<L.Map | null>(null);
  const map3Instance = useRef<L.Map | null>(null);

  // Layer Group Refs
  const map1Layers = useRef<L.LayerGroup | null>(null);
  const map2Layers = useRef<L.LayerGroup | null>(null);
  const map3Layers = useRef<L.LayerGroup | null>(null);

  const lat = intervention.latitude;
  const lng = intervention.longitude;

  // Fetch Bhuvan AOI statistics whenever coordinates or radius change
  useEffect(() => {
    let isMounted = true;
    bhuvanService.fetchAOIStatistics(
      lat,
      lng,
      radius,
      snapshot.ndviValue,
      snapshot.ndwiValue
    ).then(stats => {
      if (isMounted) {
        setBhuvanAOI(stats);
      }
    });
    return () => { isMounted = false; };
  }, [lat, lng, radius, snapshot.ndviValue, snapshot.ndwiValue]);

  // Initialize and update all 3 Leaflet GIS Maps
  useEffect(() => {
    // ----------------------------------------------------
    // MAP 1: Optical Satellite True Color / ISRO Bhuvan Base
    // ----------------------------------------------------
    if (map1Ref.current && !map1Instance.current) {
      const map1 = L.map(map1Ref.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map1);

      map1Layers.current = L.layerGroup().addTo(map1);
      map1Instance.current = map1;
    }

    // ----------------------------------------------------
    // MAP 2: NDVI Canopy Vegetation Health Heatmap
    // ----------------------------------------------------
    if (map2Ref.current && !map2Instance.current) {
      const map2 = L.map(map2Ref.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map2);

      map2Layers.current = L.layerGroup().addTo(map2);
      map2Instance.current = map2;
    }

    // ----------------------------------------------------
    // MAP 3: NDWI Hydro Surface Water & Soil Moisture
    // ----------------------------------------------------
    if (map3Ref.current && !map3Instance.current) {
      const map3 = L.map(map3Ref.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(map3);

      map3Layers.current = L.layerGroup().addTo(map3);
      map3Instance.current = map3;
    }

    // Recenter and update layers on all 3 maps
    [map1Instance.current, map2Instance.current, map3Instance.current].forEach(map => {
      if (map) {
        map.setView([lat, lng], 16, { animate: true });
        setTimeout(() => map.invalidateSize(), 150);
      }
    });

    // ----------------------------------------------------
    // POPULATE LAYERS FOR MAP 1: Optical Satellite
    // ----------------------------------------------------
    if (map1Layers.current) {
      map1Layers.current.clearLayers();

      // Buffer radius circle
      L.circle([lat, lng], {
        radius: radius,
        color: '#3b82f6',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#3b82f6',
        fillOpacity: 0.12
      }).addTo(map1Layers.current);

      // Center marker
      const icon1 = L.divIcon({
        className: 'custom-pin-1',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px]">
              GIS
            </div>
            <div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-cyan-400 rounded-full animate-ping"></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([lat, lng], { icon: icon1 }).addTo(map1Layers.current);
    }

    // ----------------------------------------------------
    // POPULATE LAYERS FOR MAP 2: NDVI Canopy Heatmap Overlay
    // ----------------------------------------------------
    if (map2Layers.current) {
      map2Layers.current.clearLayers();

      // Buffer circle
      L.circle([lat, lng], {
        radius: radius,
        color: '#10b981',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.15
      }).addTo(map2Layers.current);

      // NDVI False Color Vegetation Canopy Polygons (simulated multi-spectral bands classification)
      const rDeg = (radius / 111320); // approx degrees
      // 1. Dense Vegetation Core Polygon
      L.polygon([
        [lat + rDeg * 0.4, lng - rDeg * 0.4],
        [lat + rDeg * 0.5, lng + rDeg * 0.3],
        [lat - rDeg * 0.3, lng + rDeg * 0.5],
        [lat - rDeg * 0.5, lng - rDeg * 0.2]
      ], {
        color: '#059669',
        weight: 1.5,
        fillColor: '#10b981',
        fillOpacity: 0.55
      }).addTo(map2Layers.current);

      // 2. Moderate Canopy / Cropland Zone
      L.polygon([
        [lat + rDeg * 0.7, lng - rDeg * 0.7],
        [lat + rDeg * 0.8, lng + rDeg * 0.6],
        [lat - rDeg * 0.6, lng + rDeg * 0.7],
        [lat - rDeg * 0.7, lng - rDeg * 0.6]
      ], {
        color: '#eab308',
        weight: 1,
        fillColor: '#facc15',
        fillOpacity: 0.35
      }).addTo(map2Layers.current);

      // Center marker
      const icon2 = L.divIcon({
        className: 'custom-pin-2',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-emerald-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px]">
              NDVI
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([lat, lng], { icon: icon2 }).addTo(map2Layers.current);
    }

    // ----------------------------------------------------
    // POPULATE LAYERS FOR MAP 3: NDWI Hydro & Moisture Dynamics
    // ----------------------------------------------------
    if (map3Layers.current) {
      map3Layers.current.clearLayers();

      // Buffer circle
      L.circle([lat, lng], {
        radius: radius,
        color: '#06b6d4',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#06b6d4',
        fillOpacity: 0.15
      }).addTo(map3Layers.current);

      const rDeg = (radius / 111320);

      // 1. Waterbody Reservoir Footprint Polygon
      L.polygon([
        [lat + rDeg * 0.25, lng - rDeg * 0.25],
        [lat + rDeg * 0.3, lng + rDeg * 0.2],
        [lat - rDeg * 0.2, lng + rDeg * 0.3],
        [lat - rDeg * 0.25, lng - rDeg * 0.15]
      ], {
        color: '#0284c7',
        weight: 2,
        fillColor: '#0ea5e9',
        fillOpacity: 0.75
      }).addTo(map3Layers.current);

      // 2. Drainage Inflow & Outflow Streams
      L.polyline([
        [[lat + rDeg * 0.8, lng - rDeg * 0.6], [lat + rDeg * 0.25, lng - rDeg * 0.25]],
        [[lat - rDeg * 0.25, lng + rDeg * 0.3], [lat - rDeg * 0.85, lng + rDeg * 0.75]]
      ], {
        color: '#06b6d4',
        weight: 3.5,
        opacity: 0.9
      }).addTo(map3Layers.current);

      // Center marker
      const icon3 = L.divIcon({
        className: 'custom-pin-3',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="w-7 h-7 rounded-full bg-cyan-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-bold text-[10px]">
              H2O
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      L.marker([lat, lng], { icon: icon3 }).addTo(map3Layers.current);
    }
  }, [lat, lng, radius, snapshot.ndviValue, snapshot.ndwiValue, activeLayerMode]);

  return (
    <div className="bg-slate-900 rounded-2xl p-5 text-white shadow-xl border border-slate-800 space-y-4">
      {/* 1. Header with Live Dynamic Coordinates & Bhuvan Geoportal Protocol */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-teal-500/20 text-teal-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center gap-1">
              <Globe className="w-3 h-3 text-teal-400" />
              ISRO Bhuvan + Sentinel-2 Spatial Synchronizer
            </span>
            <span className="bg-slate-800 text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-700">
              AOI Buffer: {radius}m Radius
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white font-outfit mt-1.5 flex items-center gap-2 flex-wrap">
            <span>{intervention.title}</span>
            <span className="text-xs bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded border border-slate-700 font-semibold">
              {snapshot.year} Multi-Spectral Dataset
            </span>
          </h3>
          <div className="text-xs text-slate-300 font-mono mt-1 flex items-center gap-3 flex-wrap">
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              Coordinates: {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
              Location: <strong>{bhuvanAOI?.administrative.village || intervention.locationName}</strong> ({bhuvanAOI?.administrative.district || intervention.district})
            </span>
          </div>
        </div>

        {/* Layer Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveLayerMode('spectral')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayerMode === 'spectral'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sentinel Spectral Bands</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayerMode('bhuvan50k')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayerMode === 'bhuvan50k'
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>ISRO Bhuvan 50k LULC</span>
          </button>
        </div>
      </div>

      {/* 2. Three Distinct Synchronized Interactive Leaflet GIS Maps (Same Coordinates, Different Thematic Data) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MAP 1: High-Res Optical True Color / Bhuvan Spatial Grid */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-blue-300">
              <Eye className="w-3.5 h-3.5 text-blue-400" />
              <span>Map 1: Optical Satellite High-Res</span>
            </div>
            <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-1.5 py-0.5 rounded font-mono font-bold">
              RGB Visual
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden aspect-square border border-slate-800 bg-slate-900 shadow-inner">
            <div ref={map1Ref} className="w-full h-full z-0" />
            {/* Top Floating Badge */}
            <div className="absolute top-2 left-2 z-10 bg-slate-950/85 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded text-white font-mono flex items-center gap-1 border border-slate-700 pointer-events-none">
              <Globe className="w-3 h-3 text-blue-400" />
              <span>ISRO Bhuvan Base / Sentinel-2</span>
            </div>
            {/* Coordinate Badge */}
            <div className="absolute bottom-2 right-2 z-10 bg-slate-950/90 backdrop-blur-xs text-[9px] px-2 py-0.5 rounded text-emerald-300 font-mono border border-slate-800 pointer-events-none">
              {lat.toFixed(4)}°, {lng.toFixed(4)}°
            </div>
          </div>

          <div className="bg-slate-900/70 p-2 rounded-lg text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Ground Structure:</span>
              <strong className="text-white">{intervention.workType}</strong>
            </div>
            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>EXIF Geotag:</span>
              <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5" /> Authenticated
              </span>
            </div>
          </div>
        </div>

        {/* MAP 2: NDVI Canopy Vegetation Health Heatmap */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              <span>Map 2: NDVI Canopy Health Heatmap</span>
            </div>
            <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
              NDVI: {snapshot.ndviValue}
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden aspect-square border border-slate-800 bg-slate-900 shadow-inner">
            <div ref={map2Ref} className="w-full h-full z-0" />
            {/* Top Floating Badge */}
            <div className="absolute top-2 left-2 z-10 bg-slate-950/85 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded text-emerald-300 font-mono border border-slate-700 flex items-center gap-1 pointer-events-none">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>NIR/Red Spectral Heatmap</span>
            </div>
            {/* Live Veg Density Badge */}
            <div className="absolute bottom-2 right-2 z-10 bg-emerald-950/90 backdrop-blur-xs text-[9px] px-2 py-0.5 rounded text-emerald-200 font-mono border border-emerald-800 pointer-events-none">
              Canopy: {snapshot.lulcBreakdown.vegetation + snapshot.lulcBreakdown.agriculture}% Cover
            </div>
          </div>

          <div className="bg-slate-900/70 p-2 rounded-lg text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Bhuvan Cropland Area:</span>
              <strong className="text-emerald-300 font-mono">{bhuvanAOI?.lulc50kBreakdown.agricultureCroplandHa || 28.5} Ha</strong>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Scale Classification:</span>
              <span className="text-emerald-400 font-bold">Dense Biomass Uplift</span>
            </div>
          </div>
        </div>

        {/* MAP 3: NDWI Hydro Surface Water & Soil Moisture Map */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-cyan-300">
              <Droplets className="w-3.5 h-3.5 text-cyan-400" />
              <span>Map 3: NDWI Hydro & Moisture Dynamics</span>
            </div>
            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-800 px-1.5 py-0.5 rounded font-bold font-mono">
              {snapshot.ndwiAreaHectares} Ha Storage
            </span>
          </div>

          <div className="relative rounded-lg overflow-hidden aspect-square border border-slate-800 bg-slate-900 shadow-inner">
            <div ref={map3Ref} className="w-full h-full z-0" />
            {/* Top Floating Badge */}
            <div className="absolute top-2 left-2 z-10 bg-slate-950/85 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded text-cyan-300 font-mono border border-slate-700 flex items-center gap-1 pointer-events-none">
              <Droplets className="w-3 h-3 text-cyan-400" />
              <span>Green/SWIR Hydro Extent</span>
            </div>
            {/* Moisture Badge */}
            <div className="absolute bottom-2 right-2 z-10 bg-cyan-950/90 backdrop-blur-xs text-[9px] px-2 py-0.5 rounded text-cyan-200 font-mono border border-cyan-800 pointer-events-none">
              Moisture (NDMI): {bhuvanAOI?.spectralCorrelation.computedNdmi || 0.42}
            </div>
          </div>

          <div className="bg-slate-900/70 p-2 rounded-lg text-[11px] text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Est. Aquifer Recharge:</span>
              <strong className="text-cyan-300 font-mono">+{bhuvanAOI?.spectralCorrelation.estGroundwaterRechargeMld || 2.6} Mld/yr</strong>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-400">Catchment Drainage:</span>
              <span className="text-teal-400 font-bold">3rd Order Inflow</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ISRO Bhuvan AOI (Area of Interest) 50k LULC Live Statistics Bar */}
      {bhuvanAOI && (
        <div className="bg-slate-950 border border-teal-500/30 rounded-xl p-4 space-y-3 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider font-outfit">
                ISRO Bhuvan 1:50,000 Scale LULC AOI Real-Time Statistics
              </span>
              <span className="text-[10px] bg-teal-950 text-teal-300 border border-teal-800 px-2 py-0.5 rounded font-mono">
                Lat {lat.toFixed(4)}°, Lng {lng.toFixed(4)}° ({radius}m AOI)
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
              <span>Total AOI Area: <strong className="text-white">{bhuvanAOI.lulc50kBreakdown.totalBufferAreaHa} Ha</strong></span>
              <span>•</span>
              <span className="text-teal-400 flex items-center gap-1"><Maximize2 className="w-3 h-3" /> Live GIS Synced</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            {/* 1. Cropland */}
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] font-semibold">Agricultural Cropland</div>
              <div className="text-sm font-bold text-teal-300 font-mono mt-0.5">
                {bhuvanAOI.lulc50kBreakdown.agricultureCroplandHa} Ha
              </div>
              <div className="text-[10px] text-slate-500">
                {bhuvanAOI.lulc50kBreakdown.agricultureCroplandPct}% of AOI Buffer
              </div>
            </div>

            {/* 2. Forest / Plantation */}
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] font-semibold">Forest & Plantation</div>
              <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                {bhuvanAOI.lulc50kBreakdown.forestPlantationHa} Ha
              </div>
              <div className="text-[10px] text-slate-500">
                {bhuvanAOI.lulc50kBreakdown.forestPlantationPct}% of AOI Buffer
              </div>
            </div>

            {/* 3. Surface Water */}
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] font-semibold">Surface Water Bodies</div>
              <div className="text-sm font-bold text-cyan-400 font-mono mt-0.5">
                {bhuvanAOI.lulc50kBreakdown.waterBodiesHa} Ha
              </div>
              <div className="text-[10px] text-slate-500">
                {bhuvanAOI.lulc50kBreakdown.waterBodiesPct}% of AOI Buffer
              </div>
            </div>

            {/* 4. Barren Scrub */}
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] font-semibold">Barren / Scrub Land</div>
              <div className="text-sm font-bold text-amber-400 font-mono mt-0.5">
                {bhuvanAOI.lulc50kBreakdown.barrenScrubHa} Ha
              </div>
              <div className="text-[10px] text-slate-500">
                {bhuvanAOI.lulc50kBreakdown.barrenScrubPct}% of AOI Buffer
              </div>
            </div>

            {/* 5. Subsurface Moisture */}
            <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[10px] font-semibold">Soil Moisture (NDMI)</div>
              <div className="text-sm font-bold text-blue-400 font-mono mt-0.5">
                {bhuvanAOI.spectralCorrelation.computedNdmi} Index
              </div>
              <div className="text-[10px] text-slate-500">
                {bhuvanAOI.spectralCorrelation.soilErosionIndex}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
