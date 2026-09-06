import { useState } from 'react';
import { getStoredCredentials, saveStoredCredentials, testCopernicusConnection } from '../utils/copernicusService';
import { Key, CheckCircle2, AlertCircle, RefreshCw, X, Globe, ExternalLink, ShieldCheck } from 'lucide-react';

interface CopernicusSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCredentialsUpdated: () => void;
}

export function CopernicusSettingsModal({ isOpen, onClose, onCredentialsUpdated }: CopernicusSettingsModalProps) {
  const stored = getStoredCredentials();
  const [clientId, setClientId] = useState<string>(stored.clientId);
  const [clientSecret, setClientSecret] = useState<string>(stored.clientSecret);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testMessage, setTestMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!clientId.trim() || !clientSecret.trim()) {
      setTestStatus('error');
      setTestMessage('Please enter both Client ID and Client Secret.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Authenticating with Copernicus Data Space Ecosystem...');

    const result = await testCopernicusConnection({
      clientId: clientId.trim(),
      clientSecret: clientSecret.trim()
    });

    if (result.success) {
      setTestStatus('success');
      setTestMessage(result.message);
    } else {
      setTestStatus('error');
      setTestMessage(result.message);
    }
  };

  const handleSave = () => {
    saveStoredCredentials(clientId, clientSecret);
    onCredentialsUpdated();
    onClose();
  };

  const handleClear = () => {
    saveStoredCredentials('', '');
    setClientId('');
    setClientSecret('');
    setTestStatus('idle');
    setTestMessage('');
    onCredentialsUpdated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-500/20 rounded-xl border border-teal-400/30">
              <Globe className="w-6 h-6 text-teal-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight">Copernicus Sentinel-2 API</h3>
              <p className="text-xs text-slate-300">Live Satellite Data Ecosystem Integration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Secure Client Credentials</p>
              <p>
                Get your free API credentials at the{' '}
                <a
                  href="https://dataspace.copernicus.eu/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal-600 underline font-medium inline-flex items-center gap-0.5 hover:text-teal-700"
                >
                  Copernicus Data Space Portal <ExternalLink className="w-3 h-3" />
                </a>. Credentials are stored securely in local browser session.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                OAuth2 Client ID
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. 01a23b45-6789-4bcd-8ef0-123456789abc"
                  value={clientId}
                  onChange={e => setClientId(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                OAuth2 Client Secret
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  placeholder="••••••••••••••••••••••••••••••••"
                  value={clientSecret}
                  onChange={e => setClientSecret(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Test Status Banner */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 ${
                testStatus === 'testing'
                  ? 'bg-blue-50 border-blue-200 text-blue-800'
                  : testStatus === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testStatus === 'testing' && <RefreshCw className="w-4 h-4 animate-spin shrink-0 text-blue-600" />}
              {testStatus === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />}
              {testStatus === 'error' && <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />}
              <span className="font-medium">{testMessage}</span>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <button
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testStatus === 'testing' ? 'animate-spin' : ''}`} />
              Test API Connection
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Clear
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Credentials
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
