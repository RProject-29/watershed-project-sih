import type { Intervention, ChangeAnalysis } from '../types';
import React from 'react';
import { MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InterventionDetailCardProps {
  intervention: Intervention;
  change: ChangeAnalysis;
  onVerify: () => void;
}

export const InterventionDetailCard: React.FC<InterventionDetailCardProps> = ({
  intervention,
  change,
  onVerify
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 text-slate-800 space-y-4">
      {/* Header Info */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200">
            {intervention.id}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
            intervention.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
            intervention.status === 'NeedsReview' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
          }`}>
            {intervention.status}
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 font-outfit leading-snug">
          {intervention.title}
        </h3>
        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{intervention.locationName}, {intervention.district}</span>
        </p>
      </div>

      {/* Field Photo & EXIF Metadata Badge */}
      <div className="relative rounded-lg overflow-hidden border border-slate-200 group">
        <img src={intervention.photoUrl} alt={intervention.title} className="w-full h-44 object-cover" />
        
        <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur-xs text-white p-2 rounded-md text-[10px] space-y-0.5 border border-slate-700">
          <div className="font-bold text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> EXIF Geotag Verified ({intervention.exifData.make} {intervention.exifData.model})
          </div>
          <div className="text-slate-300 flex items-center justify-between">
            <span>Coords: <strong>{intervention.latitude.toFixed(4)}° N, {intervention.longitude.toFixed(4)}° E</strong></span>
            <span>Captured: <strong>{intervention.captureDateTime}</strong></span>
          </div>
        </div>
      </div>

      {/* Structured Details */}
      <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200">
        <div>
          <span className="text-slate-500 block text-[10px]">Work Type:</span>
          <strong className="text-slate-900 font-bold">{intervention.workType}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Implementation Year:</span>
          <strong className="text-slate-900 font-bold">{intervention.implementationYear}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">Watershed Catchment:</span>
          <strong className="text-slate-900 text-[11px] truncate block">{intervention.watershedName}</strong>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">GPS Accuracy:</span>
          <strong className="text-emerald-700 font-mono font-bold">±{intervention.exifData.accuracyMeters || 3}m</strong>
        </div>
      </div>

      {/* Remarks */}
      <div className="text-xs text-slate-600 bg-amber-50/60 border border-amber-200 p-2.5 rounded-lg">
        <strong className="text-amber-900 block text-[11px] mb-0.5">Field Officer Remarks:</strong>
        "{intervention.remarks}"
      </div>

      {/* Suggested Action */}
      <div className="bg-emerald-950 text-white p-3 rounded-xl space-y-2 text-xs border border-emerald-900">
        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
          Suggested Action Advisory
        </div>
        <p className="text-slate-200 font-medium">
          {change.suggestedAction}
        </p>

        {intervention.status !== 'Verified' && (
          <button
            onClick={onVerify}
            className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-all text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark as Verified (Positive Change)</span>
          </button>
        )}
      </div>
    </div>
  );
};
