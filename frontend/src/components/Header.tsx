import { Shield, Sparkles, Activity } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-full px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl shadow-lg hover:scale-105 transition-transform">
              <Shield className="size-8" />
            </div>
            <div>
              <h1 className="text-white mb-1 flex items-center gap-2">
                Data Quality Anomaly Detector
                <Activity className="size-5 animate-pulse text-green-300" />
              </h1>
              <p className="text-blue-100 text-sm">
                Automated detection of missing values, duplicates, inconsistencies & ML anomalies
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <Sparkles className="size-5 text-yellow-300" />
              <span className="text-sm">ML-Powered Analysis</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="size-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-100">System Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}