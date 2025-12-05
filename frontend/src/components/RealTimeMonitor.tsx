import { Card } from './ui/card';
import { Activity, Zap, Database, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function RealTimeMonitor() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [processingStatus, setProcessingStatus] = useState({
    claims: 0,
    anomalies: 0,
    processed: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setProcessingStatus(prev => ({
        claims: Math.floor(Math.random() * 100),
        anomalies: Math.floor(Math.random() * 10),
        processed: Math.min(prev.processed + 1, 100)
      }));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const metrics = [
    {
      label: 'Claims Scanned',
      value: processingStatus.claims,
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      label: 'Anomalies Detected',
      value: processingStatus.anomalies,
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Processing Rate',
      value: `${processingStatus.processed}%`,
      icon: Activity,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-0 shadow-xl relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-green-500/20 backdrop-blur-sm p-2 rounded-lg animate-pulse">
              <Activity className="size-5 text-green-400" />
            </div>
            <div>
              <h3 className="text-white mb-1">Real-Time Monitor</h3>
              <p className="text-slate-400 text-xs">
                Last updated: {currentTime.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-green-500/20 px-3 py-1.5 rounded-full">
            <div className="size-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400">Live</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className="p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/10 hover:bg-white/20 transition-all"
              >
                <div className={`${metric.bgColor} ${metric.color} p-2 rounded-lg inline-flex mb-3`}>
                  <Icon className="size-4" />
                </div>
                <p className="text-white text-xl mb-1">{metric.value}</p>
                <p className="text-slate-400 text-xs">{metric.label}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-green-400" />
            <span className="text-slate-300">System running optimally</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
