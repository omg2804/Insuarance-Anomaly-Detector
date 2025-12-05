import { Card } from './ui/card';
import { Shield, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from './ui/progress';

interface DataQualityScoreProps {
  totalClaims: number;
  totalAnomalies: number;
  duplicates: number;
  missingFields: number;
}

export function DataQualityScore({ 
  totalClaims, 
  totalAnomalies, 
  duplicates, 
  missingFields 
}: DataQualityScoreProps) {
  // Calculate overall quality score (0-100)
  const anomalyPenalty = (totalAnomalies / totalClaims) * 40;
  const duplicatePenalty = (duplicates / totalClaims) * 30;
  const missingPenalty = (missingFields / totalClaims) * 30;
  
  const qualityScore = Math.max(0, Math.round(100 - anomalyPenalty - duplicatePenalty - missingPenalty));
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: 'text-green-600', bg: 'bg-green-600', label: 'Excellent' };
    if (score >= 60) return { color: 'text-blue-600', bg: 'bg-blue-600', label: 'Good' };
    if (score >= 40) return { color: 'text-orange-600', bg: 'bg-orange-600', label: 'Fair' };
    return { color: 'text-red-600', bg: 'bg-red-600', label: 'Poor' };
  };
  
  const scoreData = getScoreColor(qualityScore);

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
      {/* Decorative circles */}
      <div className="absolute -right-8 -top-8 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute -left-8 -bottom-8 size-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
      
      {/* Animated pulse ring */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 bg-white/20 rounded-full animate-ping" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl group-hover:scale-110 transition-transform">
              <Shield className="size-6" />
            </div>
            <div>
              <h3 className="text-white mb-1">Data Quality Score</h3>
              <p className="text-blue-100 text-sm">Overall dataset health</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-white mb-1 group-hover:scale-110 transition-transform">{qualityScore}</div>
            <p className="text-xs text-blue-100">{scoreData.label}</p>
          </div>
        </div>

        <div className="mb-6">
          <Progress value={qualityScore} className="h-3 bg-white/20" />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer group/stat">
            <div className="text-white text-sm mb-1 group-hover/stat:scale-110 transition-transform">{((1 - totalAnomalies / totalClaims) * 100).toFixed(1)}%</div>
            <p className="text-xs text-blue-100">Accuracy</p>
          </div>
          <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer group/stat">
            <div className="text-white text-sm mb-1 group-hover/stat:scale-110 transition-transform">{((1 - missingFields / totalClaims) * 100).toFixed(1)}%</div>
            <p className="text-xs text-blue-100">Completeness</p>
          </div>
          <div className="text-center p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all cursor-pointer group/stat">
            <div className="text-white text-sm mb-1 group-hover/stat:scale-110 transition-transform">{((1 - duplicates / totalClaims) * 100).toFixed(1)}%</div>
            <p className="text-xs text-blue-100">Uniqueness</p>
          </div>
        </div>
      </div>
    </Card>
  );
}