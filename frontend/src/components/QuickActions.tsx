import { Card } from './ui/card';
import { Button } from './ui/button';
import { FileDown, Share2, RefreshCw, Settings2, Mail, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';

export function QuickActions() {
  const actions = [
    {
      icon: FileDown,
      label: 'Export Full Report',
      description: 'Download complete analysis',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => toast.success('Full report downloaded!')
    },
    {
      icon: FileSpreadsheet,
      label: 'Export to Excel',
      description: 'Excel format with charts',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => toast.success('Excel file downloaded!')
    },
    {
      icon: Share2,
      label: 'Share Dashboard',
      description: 'Generate shareable link',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => toast.success('Link copied to clipboard!')
    },
    {
      icon: Mail,
      label: 'Email Report',
      description: 'Send to stakeholders',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => toast.success('Report sent via email!')
    },
    {
      icon: RefreshCw,
      label: 'Refresh Data',
      description: 'Re-run analysis',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      onClick: () => toast.info('Refreshing data...')
    },
    {
      icon: Settings2,
      label: 'Configure Rules',
      description: 'Adjust detection settings',
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
      onClick: () => toast.info('Opening settings...')
    },
  ];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">
        <h3 className="text-slate-900 mb-1">Quick Actions</h3>
        <p className="text-xs text-slate-500">Common tasks and exports</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={action.onClick}
              className="h-auto p-4 flex flex-col items-start gap-2 hover:shadow-md transition-all group"
            >
              <div className={`${action.bgColor} ${action.color} p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className="size-4" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-900">{action.label}</p>
                <p className="text-xs text-slate-500">{action.description}</p>
              </div>
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
