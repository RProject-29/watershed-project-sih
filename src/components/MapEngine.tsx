import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import type { Intervention, GISLayer, AnalysisRadius } from '../types';
import { MapPin, Compass } from 'lucide-react';

interface MapEngineProps {
  interventions: Intervention[];
  selectedIntervention: Intervention;
  onSelectIntervention: (id: string) => void;
  gisLayers: GISLayer[];
  radius: AnalysisRadius;
}

export const MapEngine: React.FC<MapEngineProps> = ({
  interventions,
  selectedIntervention,
  onSelectIntervention,
  gisLayers,
  radius
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center: [selectedIntervention.latitude, selectedIntervention.longitude],
        zoom: 15,
        zoomControl: false
      });

      // High Resolution Esri World Imagery Satellite Tile Layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; ISRO Bhuvan / Bhoonidhi GIS',
        maxZoom: 19
      }).addTo(map);

      // Add Zoom Control at top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);

      // Invalidate size after mount to ensure tiles render perfectly
      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    } else {
      mapInstanceRef.current.flyTo([selectedIntervention.latitude, selectedIntervention.longitude], 15, {
        animate: true,
        duration: 1.2
      });
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 100);
    }
  }, [selectedIntervention.id, selectedIntervention.latitude, selectedIntervention.longitude]);

  // Update Markers, Buffer Circle, and GIS Vector Layers when selection/layers change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Watershed Boundary Layer
    const watershedLayer = gisLayers.find(l => l.id === 'watershed_poly');
    if (watershedLayer?.visible) {
      const watershedPolygon = L.polygon([
        [19.1200, 74.4300],
        [19.1250, 74.4750],
        [19.0700, 74.4850],
        [19.0650, 74.4350]
      ], {
        color: '#8b5cf6',
        weight: 2,
        dashArray: '6, 6',
        fillColor: '#8b5cf6',
        fillOpacity: 0.12
      });
      watershedPolygon.addTo(layerGroup);
    }

    // 2. Drainage Network Layer
    const drainageLayer = gisLayers.find(l => l.id === 'drainage_net');
    if (drainageLayer?.visible) {
      const streamLines = L.polyline([
        [[19.1150, 74.4350], [19.0950, 74.4480], [19.0880, 74.4530], [19.0700, 74.4700]],
        [[19.1050, 74.4650], [19.0940, 74.4480]]
      ], {
        color: '#06b6d4',
        weight: 3,
        opacity: 0.85
      });
      streamLines.addTo(layerGroup);
    }

    // 3. Exact Radius Buffer Circle (500m / 1000m / 2000m) around Selected Intervention
    const bufferCircle = L.circle([selectedIntervention.latitude, selectedIntervention.longitude], {
      radius: radius,
      color: '#10b981',
      weight: 2.5,
      dashArray: '6, 4',
      fillColor: '#10b981',
      fillOpacity: 0.18
    });
    bufferCircle.addTo(layerGroup);

    // 4. Render Markers for all interventions
    interventions.forEach(item => {
      const isSelected = item.id === selectedIntervention.id;

      let colorClass = 'bg-emerald-500 border-emerald-300';
      if (item.status === 'NeedsReview') colorClass = 'bg-amber-500 border-amber-300';
      if (item.status === 'PriorityInspection') colorClass = 'bg-rose-500 border-rose-300';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div class="relative group cursor-pointer">
            <div class="w-8 h-8 rounded-full ${colorClass} border-2 text-white font-bold text-[11px] flex items-center justify-center shadow-xl transition-transform ${isSelected ? 'scale-125 ring-4 ring-white shadow-emerald-500/50' : 'hover:scale-110'}">
              ${item.workType.slice(0, 2).toUpperCase()}
            </div>
            ${isSelected ? '<div class="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping"></div>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      const marker = L.marker([item.latitude, item.longitude], { icon: customIcon });

      const popupContent = `
        <div style="font-family: sans-serif; font-size: 12px; width: 210px; padding: 2px;">
          <img src="${item.photoUrl}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <strong style="display: block; font-size: 13px; color: #0f172a; line-height: 1.2;">${item.title}</strong>
          <div style="color: #64748b; font-size: 11px; margin-top: 2px;">${item.locationName}</div>
          <div style="margin-top: 6px; font-family: monospace; font-size: 10px; color: #047857; background: #ecfdf5; padding: 4px; border-radius: 4px; border: 1px solid #a7f3d0;">
            GPS: ${item.latitude.toFixed(4)}° N, ${item.longitude.toFixed(4)}° E
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on('click', () => {
        onSelectIntervention(item.id);
      });

      marker.addTo(layerGroup);
    });
  }, [interventions, selectedIntervention, gisLayers, radius, onSelectIntervention]);

  return (
    <div className="relative w-full h-[480px] rounded-xl overflow-hidden shadow-lg border border-slate-800">
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Bhuvan Live Stream & Active Coordinates Badge */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/95 backdrop-blur-xs text-white border border-slate-700 rounded-xl px-3.5 py-2 shadow-xl flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold font-outfit">Bhuvan / Bhoonidhi GIS Stream</span>
        </div>
        <div className="h-4 w-px bg-slate-700 hidden sm:block" />
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-emerald-300">
          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
          <span>Lat: {selectedIntervention.latitude.toFixed(4)}° N, Long: {selectedIntervention.longitude.toFixed(4)}° E</span>
        </div>
      </div>

      {/* Map Legend Floating Box */}
      <div className="absolute bottom-3 right-3 z-10 bg-slate-900/95 backdrop-blur-xs text-white border border-slate-700 rounded-xl p-3 shadow-xl text-[11px] space-y-1.5">
        <div className="font-bold text-slate-200 border-b border-slate-800 pb-1 mb-1 flex items-center justify-between">
          <span>Map Pin Legend</span>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <Compass className="w-3 h-3" /> {radius}m Radius
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Verified Positive Change</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Needs Review</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500"></span>
          <span>Priority Inspection</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800 text-[10px] text-emerald-300 font-mono">
          <span className="w-3 h-3 rounded-full border border-dashed border-emerald-400"></span>
          <span>AOI Extraction Buffer ({ (Math.PI * Math.pow(radius/1000, 2)).toFixed(2) } km²)</span>
        </div>
      </div>
    </div>
  );
};
