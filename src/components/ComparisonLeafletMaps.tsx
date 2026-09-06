import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Intervention, SatelliteSnapshot, AnalysisRadius } from '../types';
import { Sparkles, Droplets, TreePine, Eye } from 'lucide-react';

interface ComparisonLeafletMapsProps {
  intervention: Intervention;
  beforeSnapshot: SatelliteSnapshot;
  afterSnapshot: SatelliteSnapshot;
  beforeYear: number;
  afterYear: number;
  radius: AnalysisRadius;
  viewMode: 'rgb' | 'ndvi' | 'ndwi';
}

export const ComparisonLeafletMaps: React.FC<ComparisonLeafletMapsProps> = ({
  intervention,
  beforeSnapshot,
  afterSnapshot,
  beforeYear,
  afterYear,
  radius,
  viewMode
}) => {
  const beforeContainerRef = useRef<HTMLDivElement>(null);
  const afterContainerRef = useRef<HTMLDivElement>(null);

  const beforeMapInstance = useRef<L.Map | null>(null);
  const afterMapInstance = useRef<L.Map | null>(null);

  const beforeLayers = useRef<L.LayerGroup | null>(null);
  const afterLayers = useRef<L.LayerGroup | null>(null);

  const lat = intervention.latitude;
  const lng = intervention.longitude;

  // Initialize both Leaflet Maps
  useEffect(() => {
    // 1. BEFORE MAP
    if (beforeContainerRef.current && !beforeMapInstance.current) {
      const bMap = L.map(beforeContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(bMap);

      beforeLayers.current = L.layerGroup().addTo(bMap);
      beforeMapInstance.current = bMap;
    }

    // 2. AFTER MAP
    if (afterContainerRef.current && !afterMapInstance.current) {
      const aMap = L.map(afterContainerRef.current, {
        center: [lat, lng],
        zoom: 16,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19
      }).addTo(aMap);

      afterLayers.current = L.layerGroup().addTo(aMap);
      afterMapInstance.current = aMap;
    }

    // Recenter both maps to the current field coordinates
    [beforeMapInstance.current, afterMapInstance.current].forEach(map => {
      if (map) {
        map.setView([lat, lng], 16, { animate: true });
        setTimeout(() => map.invalidateSize(), 150);
      }
    });

    const rDeg = (radius / 111320);

    // ----------------------------------------------------
    // POPULATE LAYERS ON "BEFORE" MAP
    // ----------------------------------------------------
    if (beforeLayers.current) {
      beforeLayers.current.clearLayers();

      // Buffer radius circle (Amber / Neutral)
      L.circle([lat, lng], {
        radius: radius,
        color: '#f59e0b',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#f59e0b',
        fillOpacity: 0.10
      }).addTo(beforeLayers.current);

      if (viewMode === 'rgb') {
        // Center Pin
        const pinBefore = L.divIcon({
          className: 'pin-before',
          html: `<div class="w-6 h-6 rounded-full bg-amber-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold font-mono">B</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon: pinBefore }).addTo(beforeLayers.current);
      } else if (viewMode === 'ndvi') {
        // Baseline lower vegetation coverage polygon (more barren)
        L.polygon([
          [lat + rDeg * 0.25, lng - rDeg * 0.25],
          [lat + rDeg * 0.3, lng + rDeg * 0.2],
          [lat - rDeg * 0.2, lng + rDeg * 0.25],
          [lat - rDeg * 0.3, lng - rDeg * 0.15]
        ], {
          color: '#ca8a04',
          weight: 1.5,
          fillColor: '#eab308',
          fillOpacity: 0.35
        }).addTo(beforeLayers.current);

        const pinNdvi = L.divIcon({
          className: 'pin-ndvi-b',
          html: `<div class="w-6 h-6 rounded-full bg-yellow-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold font-mono">B</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon: pinNdvi }).addTo(beforeLayers.current);
      } else if (viewMode === 'ndwi') {
        // Baseline dry stream line
        L.polyline([
          [[lat + rDeg * 0.7, lng - rDeg * 0.5], [lat, lng]],
          [[lat, lng], [lat - rDeg * 0.7, lng + rDeg * 0.6]]
        ], {
          color: '#38bdf8',
          weight: 2,
          opacity: 0.7
        }).addTo(beforeLayers.current);

        const pinNdwi = L.divIcon({
          className: 'pin-ndwi-b',
          html: `<div class="w-6 h-6 rounded-full bg-sky-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold font-mono">B</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon: pinNdwi }).addTo(beforeLayers.current);
      }
    }

    // ----------------------------------------------------
    // POPULATE LAYERS ON "AFTER" MAP
    // ----------------------------------------------------
    if (afterLayers.current) {
      afterLayers.current.clearLayers();

      // Buffer radius circle (Emerald)
      L.circle([lat, lng], {
        radius: radius,
        color: '#10b981',
        weight: 2.5,
        dashArray: '6, 6',
        fillColor: '#10b981',
        fillOpacity: 0.15
      }).addTo(afterLayers.current);

      if (viewMode === 'rgb') {
        // Render physical intervention structure (e.g. pond footprint or check dam)
        L.polygon([
          [lat + rDeg * 0.25, lng - rDeg * 0.25],
          [lat + rDeg * 0.3, lng + rDeg * 0.2],
          [lat - rDeg * 0.2, lng + rDeg * 0.3],
          [lat - rDeg * 0.25, lng - rDeg * 0.15]
        ], {
          color: '#0284c7',
          weight: 2,
          fillColor: '#0ea5e9',
          fillOpacity: 0.85
        }).addTo(afterLayers.current);

        const pinAfter = L.divIcon({
          className: 'pin-after',
          html: `<div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold font-mono">A</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon: pinAfter }).addTo(afterLayers.current);
      } else if (viewMode === 'ndvi') {
        // Target expanded lush green canopy heatmap polygon
        L.polygon([
          [lat + rDeg * 0.5, lng - rDeg * 0.5],
          [lat + rDeg * 0.6, lng + rDeg * 0.4],
          [lat - rDeg * 0.4, lng + rDeg * 0.55],
          [lat - rDeg * 0.55, lng - rDeg * 0.3]
        ], {
          color: '#059669',
          weight: 2,
          fillColor: '#10b981',
          fillOpacity: 0.65
        }).addTo(afterLayers.current);

        const pinNdviA = L.divIcon({
          className: 'pin-ndvi-a',
          html: `<div class="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold font-mono">A</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon: pinNdviA }).addTo(afterLayers.current);
      } else if (viewMode === 'ndwi') {
        // Target full waterbody reservoir + moisture retention buffer
        L.polygon([
          [lat + rDeg * 0.3, lng - rDeg * 0.3],
          [lat + rDeg * 0.35, lng + rDeg * 0.25],
          [lat - rDeg * 0.25, lng + rDeg * 0.35],
          [lat - rDeg * 0.3, lng - rDeg * 0.2]
        ], {
          color: '#0369a1',
          weight: 2.5,
          fillColor: '#0284c7',
          fillOpacity: 0.9
        }).addTo(afterLayers.current);

        // Hydro drainage streams
        L.polyline([
          [[lat + rDeg * 0.8, lng - rDeg * 0.6], [lat, lng]],
          [[lat, lng], [lat - rDeg * 0.8, lng + rDeg * 0.7]]
        ], {
          color: '#06b6d4',
          weight: 3.5,
          opacity: 0.95
        }).addTo(afterLayers.current);

        const pinNdwiA = L.divIcon({
          className: 'pin-ndwi-a',
          html: `<div class="w-6 h-6 rounded-full bg-cyan-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[9px] font-bold font-mono">A</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });
        L.marker([lat, lng], { icon: pinNdwiA }).addTo(afterLayers.current);
      }
    }
  }, [lat, lng, radius, beforeYear, afterYear, viewMode, beforeSnapshot, afterSnapshot]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      {/* 1. BASELINE MAP (BEFORE) */}
      <div className="bg-slate-900 rounded-xl p-3.5 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-amber-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            BEFORE: {beforeSnapshot.monthName} {beforeYear} (Baseline)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {beforeSnapshot.satelliteSource}
          </span>
        </div>

        {/* Real Leaflet Map Container for Before */}
        <div className="relative rounded-lg overflow-hidden aspect-video border border-slate-800 bg-slate-950 shadow-inner">
          <div ref={beforeContainerRef} className="w-full h-full z-0" />
          
          {/* Top Floating Badge */}
          <div className="absolute top-2 left-2 z-10 bg-slate-950/85 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded text-amber-300 font-mono border border-slate-700 pointer-events-none flex items-center gap-1">
            {viewMode === 'rgb' && <Eye className="w-3 h-3 text-blue-400" />}
            {viewMode === 'ndvi' && <TreePine className="w-3 h-3 text-yellow-400" />}
            {viewMode === 'ndwi' && <Droplets className="w-3 h-3 text-sky-400" />}
            <span>{viewMode === 'rgb' ? 'Baseline Optical' : viewMode === 'ndvi' ? 'Baseline NDVI Canopy' : 'Baseline Hydro NDWI'}</span>
          </div>

          {/* Coordinate Badge */}
          <div className="absolute bottom-2 right-2 z-10 bg-slate-950/90 backdrop-blur-xs text-[9px] px-2 py-0.5 rounded text-slate-300 font-mono border border-slate-800 pointer-events-none">
            {lat.toFixed(4)}°, {lng.toFixed(4)}°
          </div>
        </div>

        {/* Bottom Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 text-center bg-slate-950 p-2 rounded-lg border border-slate-800">
          <div>NDVI: <strong className="text-amber-400">{beforeSnapshot.ndviValue}</strong></div>
          <div>Water: <strong className="text-cyan-400">{beforeSnapshot.ndwiAreaHectares} Ha</strong></div>
          <div>Barren: <strong className="text-rose-400">{beforeSnapshot.lulcBreakdown.barren}%</strong></div>
        </div>
      </div>

      {/* 2. TARGET POST-WORK MAP (AFTER) */}
      <div className="bg-slate-900 rounded-xl p-3.5 text-white border border-slate-800 shadow-md flex flex-col justify-between space-y-2">
        <div className="flex items-center justify-between">
          <span className="bg-emerald-500/20 text-emerald-300 font-bold px-2.5 py-0.5 rounded-full text-xs border border-emerald-500/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            AFTER: {afterSnapshot.monthName} {afterYear} (Target Post-Work)
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            {afterSnapshot.satelliteSource}
          </span>
        </div>

        {/* Real Leaflet Map Container for After */}
        <div className="relative rounded-lg overflow-hidden aspect-video border border-slate-800 bg-slate-950 shadow-inner">
          <div ref={afterContainerRef} className="w-full h-full z-0" />

          {/* Top Floating Badge */}
          <div className="absolute top-2 left-2 z-10 bg-slate-950/85 backdrop-blur-xs text-[10px] px-2 py-0.5 rounded text-emerald-300 font-mono border border-slate-700 pointer-events-none flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>{viewMode === 'rgb' ? 'Verified Structure GIS' : viewMode === 'ndvi' ? 'Target Vegetation Uplift' : 'Target Water Reservoir'}</span>
          </div>

          {/* Coordinate Badge */}
          <div className="absolute bottom-2 right-2 z-10 bg-slate-950/90 backdrop-blur-xs text-[9px] px-2 py-0.5 rounded text-emerald-300 font-mono border border-slate-800 pointer-events-none">
            {lat.toFixed(4)}°, {lng.toFixed(4)}°
          </div>
        </div>

        {/* Bottom Metrics Strip */}
        <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 text-center bg-slate-950 p-2 rounded-lg border border-slate-800">
          <div>NDVI: <strong className="text-emerald-400">{afterSnapshot.ndviValue}</strong></div>
          <div>Water: <strong className="text-cyan-400">{afterSnapshot.ndwiAreaHectares} Ha</strong></div>
          <div>Barren: <strong className="text-emerald-400">{afterSnapshot.lulcBreakdown.barren}%</strong></div>
        </div>
      </div>
    </div>
  );
};
