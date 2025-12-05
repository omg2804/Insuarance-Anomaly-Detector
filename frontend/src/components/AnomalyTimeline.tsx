import { Card } from './ui/card';
import { Clock, AlertCircle, TrendingUp } from 'lucide-react';

interface Claim {
  claim_id: string;
  date_of_service: string;
  anomaly_score: number;
  specialty: string;
  amount: number;
}

interface AnomalyTimelineProps {
  data: Claim[];
  threshold: number;
}

export function AnomalyTimeline({ data, threshold }: AnomalyTimelineProps) {
  // Get anomalies sorted by date
  const anomalies = data
    .filter(d => d.anomaly_score >= threshold)
    .sort((a, b) => new Date(b.date_of_service).getTime() - new Date(a.date_of_service).getTime())
    .slice(0, 5);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getSeverityColor = (score: number) => {
    if (score >= 10) return { bg: 'bg-red-500', text: 'text-red-600', label: 'Critical' };
    if (score >= 7) return { bg: 'bg-orange-500', text: 'text-orange-600', label: 'High' };
    return { bg: 'bg-yellow-500', text: 'text-yellow-600', label: 'Medium' };
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-purple-50 p-2 rounded-lg">
          <Clock className="size-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-slate-900">Recent Anomaly Timeline</h3>
          <p className="text-xs text-slate-500">Latest flagged claims chronologically</p>
        </div>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-3 bottom-3 w-0.5 bg-gradient-to-b from-purple-200 via-blue-200 to-transparent" />

        <div className="space-y-4">
          {anomalies.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="size-12 text-green-500 mx-auto mb-3" />
              <p className="text-slate-700 mb-1">No Recent Anomalies</p>
              <p className="text-sm text-slate-500">All claims are within normal parameters</p>
            </div>
          ) : (
            anomalies.map((anomaly, index) => {
              const dateInfo = formatDate(anomaly.date_of_service);
              const severity = getSeverityColor(anomaly.anomaly_score);

              return (
                <div key={index} className="relative pl-14">
                  {/* Timeline dot */}
                  <div className={`absolute left-4 top-3 size-5 ${severity.bg} rounded-full border-4 border-white shadow-md`} />

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm text-slate-900">{anomaly.claim_id}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            anomaly.anomaly_score >= 10 ? 'bg-red-100 text-red-700' :
                            anomaly.anomaly_score >= 7 ? 'bg-orange-100 text-orange-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {severity.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {anomaly.specialty} • ${anomaly.amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-500">
                        <p>{dateInfo.date}</p>
                        <p>{dateInfo.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`size-3 ${severity.text}`} />
                      <p className="text-xs text-slate-600">
                        Anomaly Score: <span className={severity.text}>{anomaly.anomaly_score.toFixed(2)}</span>
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}
