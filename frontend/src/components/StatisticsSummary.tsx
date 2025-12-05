import { Card } from './ui/card';
import { BarChart, TrendingUp, DollarSign, Calendar, Users } from 'lucide-react';

interface Claim {
  amount: number;
  date_of_service: string;
  specialty: string;
  provider_id: string;
}

interface StatisticsSummaryProps {
  data: Claim[];
}

export function StatisticsSummary({ data }: StatisticsSummaryProps) {
  const totalAmount = data.reduce((sum, claim) => sum + claim.amount, 0);
  const avgAmount = totalAmount / data.length;
  const maxAmount = Math.max(...data.map(d => d.amount));
  const minAmount = Math.min(...data.map(d => d.amount));
  
  const uniqueProviders = new Set(data.map(d => d.provider_id)).size;
  const uniqueSpecialties = new Set(data.map(d => d.specialty)).size;
  
  // Date range
  const dates = data.map(d => new Date(d.date_of_service));
  const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
  
  const stats = [
    {
      label: 'Average Claim Amount',
      value: `$${avgAmount.toFixed(0)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      subtext: `Range: $${minAmount} - $${maxAmount}`
    },
    {
      label: 'Total Claim Value',
      value: `$${totalAmount.toLocaleString()}`,
      icon: BarChart,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      subtext: `Across ${data.length} claims`
    },
    {
      label: 'Date Range',
      value: `${Math.ceil((maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24))} days`,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      subtext: `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`
    },
    {
      label: 'Healthcare Providers',
      value: uniqueProviders,
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      subtext: `${uniqueSpecialties} specialties`
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-5 bg-white/80 backdrop-blur-sm shadow-md hover:shadow-lg transition-all">
            <div className="flex items-start gap-3">
              <div className={`${stat.bgColor} ${stat.color} p-2.5 rounded-lg`}>
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                <p className={`${stat.color} text-lg mb-0.5`}>{stat.value}</p>
                <p className="text-xs text-slate-400 truncate">{stat.subtext}</p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
