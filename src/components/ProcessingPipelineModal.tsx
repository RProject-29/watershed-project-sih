import React, { useEffect, useState } from 'react';
import { CheckCircle2, RefreshCw, Sparkles, MapPin, Globe, Cpu, Layers } from 'lucide-react';

interface ProcessingPipelineModalProps {
  isOpen: boolean;
  onComplete: () => void;
  extractedLocation?: { lat: number; lng: number; date: string } | null;
}

interface StepItem {
  id: number;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const PIPELINE_STEPS: StepItem[] = [
  { id: 1, label: 'Field Photograph Validated', sublabel: 'Image format, resolution & integrity verified', icon: Layers },
  { id: 2, label: 'EXIF Metadata & GPS Extracted', sublabel: 'Coordinates & Timestamp parsed automatically', icon: MapPin },
  { id: 3, label: '1km AOI Bounding Box Generated', sublabel: 'Spatial buffer created around intervention pin', icon: Globe },
  { id: 4, label: 'Sentinel-2 Satellite Imagery Retrieved', sublabel: 'Acquiring optical & multispectral bands', icon: Globe },
  { id: 5, label: 'NDVI & NDWI Spectral Rasters Computed', sublabel: 'Vegetation & Surface Hydro metrics computed', icon: Cpu },
  { id: 6, label: 'AI Evidence & Recommendation Generated', sublabel: 'Synthesizing evidence for government review', icon: Sparkles }
];

export const ProcessingPipelineModal: React.FC<ProcessingPipelineModalProps> = ({
  isOpen,
  onComplete,
  extractedLocation
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= PIPELINE_STEPS.length) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 800);
          return prev;
        }
        return prev + 1;
      });
    }, 650);

    return () => {
      clearInterval(interval);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const progressPct = Math.round((currentStep / PIPELINE_STEPS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden text-white transition-all">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 p-5 border-b border-slate-800 flex items-center gap-3 relative">
          <div className="p-3 bg-emerald-500/20 rounded-xl border border-emerald-500/30 shrink-0 shadow-xs animate-pulse">
            <RefreshCw className="w-6 h-6 text-emerald-400 animate-spin" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-100 font-outfit">
                Geospatial Processing Engine Active
              </h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                {progressPct}%
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Transforming Ground Photo into Satellite Evidence (IWMP Pipeline)
            </p>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-slate-950 h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 h-full transition-all duration-500 ease-out shadow-[0_0_12px_rgba(16,185,129,0.8)]"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Steps List */}
        <div className="p-6 space-y-4">
          {extractedLocation && (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center justify-between shadow-inner">
              <span className="flex items-center gap-1.5 font-mono text-emerald-400 font-bold">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Lat: {extractedLocation.lat.toFixed(4)}° N, Lng: {extractedLocation.lng.toFixed(4)}° E
              </span>
              <span className="text-slate-500 font-mono text-[11px] bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {extractedLocation.date}
              </span>
            </div>
          )}

          <div className="space-y-2.5">
            {PIPELINE_STEPS.map(step => {
              const Icon = step.icon;
              const isCompleted = step.id < currentStep || currentStep === PIPELINE_STEPS.length;
              const isCurrent = step.id === currentStep && currentStep < PIPELINE_STEPS.length;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-xl border transition-all duration-300 flex items-center justify-between ${
                    isCompleted
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200 shadow-xs'
                      : isCurrent
                      ? 'bg-slate-800/90 border-teal-500 text-white shadow-lg shadow-teal-900/30 ring-1 ring-teal-500/40'
                      : 'bg-slate-950/40 border-slate-800/70 text-slate-500 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isCurrent
                          ? 'bg-teal-500/20 text-teal-300 animate-pulse'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs flex items-center gap-1.5">
                        <span>{step.label}</span>
                        {isCurrent && (
                          <span className="text-[10px] bg-teal-500/20 text-teal-300 font-mono px-1.5 py-0.2 rounded border border-teal-500/30">
                            Processing...
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{step.sublabel}</div>
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-teal-400 shrink-0" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-700 shrink-0" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Telemetry Footer */}
          <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1 text-slate-500">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> IWMP Pipeline Engine
            </span>
            <span className="text-emerald-400 font-bold">Copernicus L2A Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};
