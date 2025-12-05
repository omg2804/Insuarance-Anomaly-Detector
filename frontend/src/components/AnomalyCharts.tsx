import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Grid3x3 } from 'lucide-react';

interface Claim {
  claim_id: string;
  anomaly_score: number;
  amount: number;
  date_of_service: string;
  missing_critical: boolean;
  provider_id?: string;
  specialty?: string;
  denial_reason?: string | null;
  claim_status?: string;
}

interface AnomalyChartsProps {
  data: Claim[];
  threshold: number;
}

export function AnomalyCharts({ data, threshold }: AnomalyChartsProps) {
  // Anomaly Score Distribution
  const scoreDistribution = [
    { range: '0-2', count: data.filter(d => d.anomaly_score >= 0 && d.anomaly_score < 2).length },
    { range: '2-4', count: data.filter(d => d.anomaly_score >= 2 && d.anomaly_score < 4).length },
    { range: '4-6', count: data.filter(d => d.anomaly_score >= 4 && d.anomaly_score < 6).length },
    { range: '6-8', count: data.filter(d => d.anomaly_score >= 6 && d.anomaly_score < 8).length },
    { range: '8-10', count: data.filter(d => d.anomaly_score >= 8 && d.anomaly_score < 10).length },
    { range: '10+', count: data.filter(d => d.anomaly_score >= 10).length },
  ];

  // Amount Distribution (Quartiles)
  const amounts = data.map(d => d.amount).sort((a, b) => a - b);
  const q1 = amounts[Math.floor(amounts.length * 0.25)];
  const q2 = amounts[Math.floor(amounts.length * 0.5)];
  const q3 = amounts[Math.floor(amounts.length * 0.75)];
  const min = amounts[0];
  const max = amounts[amounts.length - 1];

  const boxPlotData = [
    { name: 'Min', value: min },
    { name: 'Q1', value: q1 },
    { name: 'Median', value: q2 },
    { name: 'Q3', value: q3 },
    { name: 'Max', value: max },
  ];

  // Anomalies Over Time
  const timeSeriesData = data.reduce((acc, claim) => {
    const date = claim.date_of_service.split(' ')[0];
    const existing = acc.find(d => d.date === date);
    if (existing) {
      existing.anomalies += claim.anomaly_score >= threshold ? 1 : 0;
      existing.total += 1;
    } else {
      acc.push({
        date,
        anomalies: claim.anomaly_score >= threshold ? 1 : 0,
        total: 1
      });
    }
    return acc;
  }, [] as { date: string; anomalies: number; total: number }[]).sort((a, b) => a.date.localeCompare(b.date));

  // Missing Values Heatmap Data
  const missingData = [
    { field: 'Provider ID', missing: data.filter(d => !d.provider_id).length },
    { field: 'Patient ID', missing: data.filter(d => d.missing_critical).length },
    { field: 'Specialty', missing: data.filter(d => !d.specialty).length },
    { field: 'Denial Reason', missing: data.filter(d => !d.denial_reason && d.claim_status === 'denied').length },
  ];

  return (
    <>
      {/* Anomaly Score Distribution */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-2 rounded-lg">
              <BarChart3 className="size-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-slate-900">Anomaly Score Distribution</h3>
              <p className="text-xs text-slate-500">Frequency of anomaly scores across all claims</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={scoreDistribution}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="range" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Bar dataKey="count" fill="url(#colorScore)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Claim Amount Distribution */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-green-50 p-2 rounded-lg">
              <DollarSign className="size-5 text-green-600" />
            </div>
            <div>
              <h3 className="text-slate-900">Claim Amount Distribution</h3>
              <p className="text-xs text-slate-500">Statistical breakdown of claim amounts</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={boxPlotData}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
              formatter={(value) => `$${value}`}
            />
            <Bar dataKey="value" fill="url(#colorAmount)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Anomalies Over Time */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-purple-50 p-2 rounded-lg">
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <div>
              <h3 className="text-slate-900">Anomalies Over Time</h3>
              <p className="text-xs text-slate-500">Trend analysis of anomalies by date</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={timeSeriesData}>
            <defs>
              <linearGradient id="colorAnomalies" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="#64748b" />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Legend />
            <Line type="monotone" dataKey="anomalies" stroke="#f59e0b" strokeWidth={3} name="Anomalies" dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={3} name="Total Claims" dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Missing Values Heatmap */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-red-50 p-2 rounded-lg">
              <Grid3x3 className="size-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-slate-900">Missing Values Heatmap</h3>
              <p className="text-xs text-slate-500">Data completeness analysis by field</p>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={missingData} layout="vertical">
            <defs>
              <linearGradient id="colorMissing" x1="0" y1="0" x2="1" y2="0">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#dc2626" stopOpacity={0.6}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#64748b" />
            <YAxis dataKey="field" type="category" tick={{ fontSize: 12 }} stroke="#64748b" width={120} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }} 
            />
            <Bar dataKey="missing" fill="url(#colorMissing)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}