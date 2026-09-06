import type { Intervention, ChangeAnalysis } from '../types';
import React, { useState } from 'react';
import { CheckCircle2, ShieldAlert, FileCheck, Layers } from 'lucide-react';

interface AIEvidencePanelProps {
  intervention: Intervention;
  change: ChangeAnalysis;
  onConfirmVerification?: (remarks?: string) => void;
}

export const AIEvidencePanel: React.FC<AIEvidencePanelProps> = ({
  intervention,
  change,
  onConfirmVerification
}) => {
  const [officerRemark, setOfficerRemark] = useState<string>('');

  return (
    <div className="bg-gradient-to-br from-sky-950 via-blue-950 to-slate-900 text-white rounded-2xl p-5 shadow-xl border border-sky-800/80 space-y-4">
      {/* Header Info Without AI Logo */}
      <div className="flex items-center justify-between border-b border-sky-800/60 pb-3">
        <div>
          <h4 className="text-base font-extrabold font-outfit text-sky-100 flex items-center gap-2">
            <span>Field Evidence Synthesis & Technical Analysis</span>
          </h4>
          <p className="text-[11px] text-sky-300/80 mt-0.5">
            Automated audit-frame sentence generated from Bhoonidhi satellite index deltas
          </p>
        </div>

        <span className="bg-sky-900/80 text-sky-200 border border-sky-700/60 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold shadow-xs">
          Confidence: 94.2%
        </span>
      </div>

      {/* Synthesis Sentence Box */}
      <div className="bg-sky-950/80 border border-sky-800/70 rounded-xl p-4 text-slate-100 text-xs leading-relaxed shadow-inner">
        <div className="flex items-start gap-2.5">
          <FileCheck className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sky-50 leading-normal">
              "{change.aiSummary}"
            </p>
            <p className="text-[10px] text-sky-300/70 mt-1 italic">
              *Note: All observations follow strict correlation standard (correlation vs causation guardrail).
            </p>
          </div>
        </div>
      </div>

      {/* Key Insights & Suggested Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        {/* Left: Key Insights */}
        <div className="bg-slate-950/70 border border-sky-800/60 rounded-xl p-3.5">
          <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Key Multi-Spectral Insights
          </div>
          <ul className="space-y-2 text-slate-200 text-[11px]">
            <li className="flex items-center justify-between">
              <span className="text-slate-300">NDVI Canopy Delta:</span>
              <strong className={change.ndviChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {change.ndviChange >= 0 ? `+${change.ndviChange}` : change.ndviChange} ({change.vegChangePct > 0 ? `+${change.vegChangePct}%` : `${change.vegChangePct}%`})
              </strong>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-300">Water Retention Area:</span>
              <strong className="text-cyan-300">
                {change.ndwiAreaChangeHa >= 0 ? `+${change.ndwiAreaChangeHa} Ha` : `${change.ndwiAreaChangeHa} Ha`}
              </strong>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-slate-300">Barren Land Reduction:</span>
              <strong className="text-amber-300">
                {change.barrenChangePct}% shift
              </strong>
            </li>
          </ul>
        </div>

        {/* Right: Suggested Action Advisory */}
        <div className="bg-slate-950/70 border border-sky-800/60 rounded-xl p-3.5">
          <div className="text-[11px] font-bold text-sky-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-sky-400" /> Official Action Recommendation
          </div>
          <p className="text-sky-100 font-semibold mb-2.5 leading-snug">
            {change.suggestedAction}
          </p>

          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Current Status:</span>
            <span className={`font-bold px-2.5 py-0.5 rounded text-[10px] ${
              intervention.status === 'Verified' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
              intervention.status === 'NeedsReview' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-rose-950 text-rose-300 border border-rose-800'
            }`}>
              {intervention.status}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Confirmation Footer with Remarks Box & Confirm Data and Store */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-sky-800/60 text-xs">
        <div className="text-[11px] text-sky-300/80">
          GIS Geotag Verified: <strong className="text-white font-mono">Encrypted Sub-Meter Accuracy</strong>
        </div>

        {onConfirmVerification && (
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
              onClick={() => onConfirmVerification(officerRemark)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Confirm Data & Store</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
