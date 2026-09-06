import React, { useState } from 'react';
import { Globe, ShieldCheck, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (userRole: string, userName: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState<string>('officer.dolr');
  const [password, setPassword] = useState<string>('••••••••••••');
  const [role, setRole] = useState<string>('District Watershed Officer');
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim() || !password.trim()) {
      setError('Please enter both User ID and Password.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      onLoginSuccess(role, userId === 'officer.dolr' ? 'Dr. R. K. Sharma' : 'Officer User');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-slate-100 relative overflow-hidden">
      {/* Background Decorative GIS Grids */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full filter blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex items-center justify-between text-xs text-slate-400 z-10">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-600 text-white font-extrabold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            GOVT. OF INDIA
          </span>
          <span className="text-slate-300 font-medium">Department of Land Resources (DoLR) | Ministry of Rural Development</span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[11px] text-slate-400">
          <span>ISRO NRSC Technical Partner</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">IWMP GIS Protocol</span>
        </div>
      </div>

      {/* Main Login Form Container */}
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          {/* Header */}
          <div className="p-8 text-center border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl shadow-emerald-950/50 mb-4 border border-emerald-400/30">
              <Globe className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black font-outfit tracking-tight text-white mb-1">
              JALDRISHTI
            </h1>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Watershed Monitoring & Decision-Support System
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-[11px] text-emerald-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Secure Government Portal Access
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="p-8 space-y-5">
            {error && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-4 py-2.5 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Select Official Designation / Role
              </label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 cursor-pointer"
              >
                <option value="District Watershed Officer">District Watershed Officer (Primary)</option>
                <option value="State Nodal Officer">State Nodal Officer (DoLR)</option>
                <option value="Central Ministry Administrator">Central Ministry Administrator</option>
                <option value="Field Inspection Officer">Field Inspection Officer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Government User ID
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder="Enter User ID..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter Password..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <span>Authenticating Officer Credentials...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>LOGIN TO GIS DASHBOARD</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              Authorized personnel only. All access is logged for official IWMP audit trails.
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-900/80 border-t border-slate-800 py-3 text-center text-xs text-slate-500 z-10">
        SRISHTI-DRISHTI National Remote Sensing GIS Ecosystem &copy; 2026
      </div>
    </div>
  );
};
