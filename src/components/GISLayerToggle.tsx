import type { GISLayer } from '../types';
import React from 'react';
import { Layers, Eye, EyeOff } from 'lucide-react';

interface GISLayerToggleProps {
  layers: GISLayer[];
  onToggleLayer: (id: string) => void;
}

export const GISLayerToggle: React.FC<GISLayerToggleProps> = ({
  layers,
  onToggleLayer
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-slate-800">
      <div className="flex items-center justify-between border-b border-slate-200 pb-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold font-outfit text-slate-900">
              Module G: GIS Spatial Layer Controls
            </h4>
            <p className="text-[11px] text-slate-500">
              Toggle ISRO Bhuvan 2D spatial overlays & vector layers
            </p>
          </div>
        </div>

        <span className="text-[10px] bg-slate-100 text-slate-600 font-mono px-2 py-0.5 rounded font-semibold border border-slate-200">
          Bhuvan 2D Standard
        </span>
      </div>

      {/* Layer List */}
      <div className="space-y-2 text-xs">
        {layers.map(layer => {
          return (
            <div
              key={layer.id}
              onClick={() => onToggleLayer(layer.id)}
              className={`flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer ${
                layer.visible
                  ? 'bg-slate-50 border-slate-300 shadow-xs'
                  : 'bg-white border-slate-200 opacity-60 hover:opacity-80'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={() => onToggleLayer(layer.id)}
                  className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
                />
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }}></span>
                    <span>{layer.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {layer.description}
                  </div>
                </div>
              </div>

              <div className="text-slate-400">
                {layer.visible ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
