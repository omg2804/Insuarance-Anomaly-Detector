import { Card } from './ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis } from 'recharts';
import { PieChart as PieChartIcon, Activity } from 'lucide-react';

interface Claim {
  claim_id: string;
  amount: number;
  claim_status: string;
  specialty: string;
  anomaly_score: number;
}

interface AdvancedStatsProps {
  data: Claim[];
}

export function AdvancedStats({ data }: AdvancedStatsProps) {
  // Status Distribution
  const statusData = [
    { name: 'Approved', value: data.filter(d => d.claim_status === 'approved').length, color: '#10b981' },
    { name: 'Denied', value: data.filter(d => d.claim_status === 'denied').length, color: '#ef4444' },
  ];

  // Specialty Distribution (Top 5)
  const specialtyCount = data.reduce((acc, claim) => {
    acc[claim.specialty] = (acc[claim.specialty] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const specialtyData = Object.entries(specialtyCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  // Scatter plot: Amount vs Anomaly Score
  const scatterData = data.map(d => ({
    amount: d.amount,
    anomaly: d.anomaly_score,
    status: d.claim_status
  }));

  return (
    <>
      {/* Status Distribution */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-green-50 p-2 rounded-lg">
            <PieChartIcon className="size-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-slate-900">Claim Status Distribution</h3>
            <p className="text-xs text-slate-500">Approval vs denial rates</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-green-600 mb-1">{statusData[0].value}</p>
            <p className="text-xs text-green-700">Approved</p>
          </div>
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <p className="text-red-600 mb-1">{statusData[1].value}</p>
            <p className="text-xs text-red-700">Denied</p>
          </div>
        </div>
      </Card>

      {/* Specialty Distribution */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-purple-50 p-2 rounded-lg">
            <PieChartIcon className="size-5 text-purple-600" />
          </div>
          <div>
            <h3 className="text-slate-900">Top Specialties</h3>
            <p className="text-xs text-slate-500">Claims by medical specialty</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={specialtyData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {specialtyData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* Amount vs Anomaly Scatter */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow col-span-2">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <Activity className="size-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-slate-900">Claim Amount vs Anomaly Score</h3>
            <p className="text-xs text-slate-500">Correlation analysis between claim value and anomaly detection</p>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              type="number" 
              dataKey="amount" 
              name="Amount" 
              tick={{ fontSize: 12 }} 
              stroke="#64748b"
              label={{ value: 'Claim Amount ($)', position: 'bottom', style: { fontSize: 12, fill: '#64748b' } }}
            />
            <YAxis 
              type="number" 
              dataKey="anomaly" 
              name="Anomaly Score" 
              tick={{ fontSize: 12 }} 
              stroke="#64748b"
              label={{ value: 'Anomaly Score', angle: -90, position: 'left', style: { fontSize: 12, fill: '#64748b' } }}
            />
            <ZAxis range={[60, 400]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Scatter 
              name="Approved Claims" 
              data={scatterData.filter(d => d.status === 'approved')} 
              fill="#10b981" 
              fillOpacity={0.6}
            />
            <Scatter 
              name="Denied Claims" 
              data={scatterData.filter(d => d.status === 'denied')} 
              fill="#ef4444" 
              fillOpacity={0.6}
            />
            <Legend />
          </ScatterChart>
        </ResponsiveContainer>
      </Card>
    </>
  );
}
