import { Card } from './ui/card';
import { Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface RecommendationsPanelProps {
  totalAnomalies: number;
  duplicates: number;
  missingFields: number;
}

export function RecommendationsPanel({ 
  totalAnomalies, 
  duplicates, 
  missingFields 
}: RecommendationsPanelProps) {
  const recommendations = [
    {
      title: 'Review High-Scoring Anomalies',
      description: `${totalAnomalies} claims flagged with anomaly scores above threshold require manual review`,
      priority: 'high',
      action: 'Review Now',
      show: totalAnomalies > 0
    },
    {
      title: 'Resolve Duplicate Entries',
      description: `${duplicates} duplicate claims detected. Consider merging or removing duplicates to improve data quality`,
      priority: 'medium',
      action: 'View Duplicates',
      show: duplicates > 0
    },
    {
      title: 'Complete Missing Fields',
      description: `${missingFields} claims have missing critical information. Contact providers for complete data`,
      priority: 'high',
      action: 'Export List',
      show: missingFields > 0
    },
    {
      title: 'Adjust Detection Threshold',
      description: 'Consider lowering the anomaly threshold to catch more edge cases in your analysis',
      priority: 'low',
      action: 'Configure',
      show: totalAnomalies < 3
    },
  ].filter(rec => rec.show);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-yellow-50 p-2 rounded-lg">
          <Lightbulb className="size-5 text-yellow-600" />
        </div>
        <div>
          <h3 className="text-slate-900">AI Recommendations</h3>
          <p className="text-xs text-slate-500">Actionable insights to improve data quality</p>
        </div>
      </div>

      <div className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 className="size-12 text-green-500 mx-auto mb-3" />
            <p className="text-slate-700 mb-1">All Clear!</p>
            <p className="text-sm text-slate-500">No immediate actions required</p>
          </div>
        ) : (
          recommendations.map((rec, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getPriorityColor(rec.priority)} hover:shadow-md transition-all group`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm">{rec.title}</h4>
                    <span className="text-xs px-2 py-0.5 bg-white/50 rounded-full">
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs opacity-90">{rec.description}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                className="w-full mt-2 group-hover:bg-white/50"
              >
                {rec.action}
                <ArrowRight className="size-3 ml-2" />
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
