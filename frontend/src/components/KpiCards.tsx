import { FileText, AlertTriangle, Copy, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './ui/card';

interface KpiCardsProps {
  totalClaims: number;
  totalAnomalies: number;
  duplicateClaims: number;
  missingFields: number;
  threshold: number;
}

export function KpiCards({
  totalClaims,
  totalAnomalies,
  duplicateClaims,
  missingFields,
  threshold
}: KpiCardsProps) {
  const anomalyRate = ((totalAnomalies / totalClaims) * 100).toFixed(1);
  const duplicateRate = ((duplicateClaims / totalClaims) * 100).toFixed(1);
  
  const kpis = [
    {
      label: 'Total Claims',
      value: totalClaims,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600',
      change: '+12%',
      trending: 'up'
    },
    {
      label: `Anomalies (Threshold ≥ ${threshold})`,
      value: totalAnomalies,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      gradient: 'from-orange-500 to-red-500',
      change: `${anomalyRate}%`,
      trending: 'down',
      subtitle: 'of total claims'
    },
    {
      label: 'Duplicate Entries',
      value: duplicateClaims,
      icon: Copy,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      gradient: 'from-purple-500 to-purple-600',
      change: `${duplicateRate}%`,
      trending: 'down',
      subtitle: 'of total claims'
    },
    {
      label: 'Missing Critical Fields',
      value: missingFields,
      icon: AlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      gradient: 'from-red-500 to-red-600',
      change: '-8%',
      trending: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        const TrendIcon = kpi.trending === 'up' ? TrendingUp : TrendingDown;
        return (
          <Card 
            key={index} 
            className={`p-6 border ${kpi.borderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] bg-white/80 backdrop-blur-sm group overflow-hidden relative`}
          >
            {/* Gradient overlay on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
            
            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-sm text-slate-600 mb-1">{kpi.label}</p>
                  {kpi.subtitle && (
                    <p className="text-xs text-slate-400">{kpi.subtitle}</p>
                  )}
                </div>
                <div className={`${kpi.bgColor} ${kpi.color} p-3 rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="size-6" />
                </div>
              </div>
              
              <div className="flex items-end justify-between">
                <div>
                  <p className={`${kpi.color} mb-1`}>{kpi.value}</p>
                  <div className="flex items-center gap-1 text-xs">
                    <TrendIcon className={`size-3 ${
                      kpi.trending === 'up' ? 'text-green-600' : 'text-red-600'
                    }`} />
                    <span className={`${
                      kpi.trending === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {kpi.change}
                    </span>
                    <span className="text-slate-400">vs last week</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}