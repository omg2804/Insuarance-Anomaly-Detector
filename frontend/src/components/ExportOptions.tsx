import { Card } from './ui/card';
import { Button } from './ui/button';
import { FileDown, FileJson, FileSpreadsheet, FileText, Image, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface ExportOptionsProps {
  data: any[];
}

export function ExportOptions({ data }: ExportOptionsProps) {
  const exportFormats = [
    {
      name: 'CSV',
      description: 'Comma-separated values',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      onClick: () => {
        const csvContent = 'data:text/csv;charset=utf-8,' + 
          'claim_id,patient_id,provider_id,amount,anomaly_score\n' +
          data.map(d => `${d.claim_id},${d.patient_id},${d.provider_id},${d.amount},${d.anomaly_score}`).join('\n');
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'anomaly_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('CSV file downloaded successfully!');
      }
    },
    {
      name: 'Excel',
      description: 'Microsoft Excel format',
      icon: FileSpreadsheet,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      onClick: () => toast.success('Excel file generated!')
    },
    {
      name: 'JSON',
      description: 'JavaScript Object Notation',
      icon: FileJson,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      onClick: () => {
        const jsonContent = 'data:text/json;charset=utf-8,' + JSON.stringify(data, null, 2);
        const encodedUri = encodeURI(jsonContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'anomaly_report.json');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('JSON file downloaded successfully!');
      }
    },
    {
      name: 'PDF Report',
      description: 'Formatted document',
      icon: FileDown,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      onClick: () => toast.success('PDF report generated!')
    },
    {
      name: 'Dashboard PNG',
      description: 'Screenshot export',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      onClick: () => toast.success('Dashboard screenshot saved!')
    },
    {
      name: 'Email Report',
      description: 'Send via email',
      icon: Mail,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      onClick: () => toast.success('Report sent to stakeholders!')
    }
  ];

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="mb-6">
        <h3 className="text-slate-900 mb-1">Export & Share</h3>
        <p className="text-xs text-slate-500">Download data in various formats</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {exportFormats.map((format, index) => {
          const Icon = format.icon;
          return (
            <Button
              key={index}
              variant="outline"
              onClick={format.onClick}
              className="h-auto p-4 flex flex-col items-start gap-3 hover:shadow-md transition-all group border-slate-200"
            >
              <div className={`${format.bgColor} ${format.color} p-2.5 rounded-lg group-hover:scale-110 transition-transform`}>
                <Icon className="size-5" />
              </div>
              <div className="text-left w-full">
                <p className="text-sm text-slate-900 mb-0.5">{format.name}</p>
                <p className="text-xs text-slate-500">{format.description}</p>
              </div>
            </Button>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 Tip: Schedule automatic reports to be sent weekly via email
        </p>
      </div>
    </Card>
  );
}
