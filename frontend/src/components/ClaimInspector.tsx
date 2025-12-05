import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Brain, AlertTriangle, CheckCircle2, XCircle, Copy, FileWarning, Sparkles } from 'lucide-react';

interface Claim {
  claim_id: string;
  patient_id: string | null;
  provider_id: string;
  specialty: string;
  amount: number;
  claim_status: string;
  denial_reason: string | null;
  date_of_service: string;
  anomaly_score: number;
  is_duplicate: boolean;
  missing_critical: boolean;
}

interface ClaimInspectorProps {
  claim: Claim | undefined;
}

export function ClaimInspector({ claim }: ClaimInspectorProps) {
  if (!claim) return null;

  const ruleBasedFlags = [
    { 
      type: 'missing_critical', 
      active: claim.missing_critical, 
      label: 'Missing Critical Data',
      description: 'One or more required fields are missing',
      icon: FileWarning
    },
    { 
      type: 'is_duplicate', 
      active: claim.is_duplicate, 
      label: 'Duplicate Claim',
      description: 'Similar claim detected in dataset',
      icon: Copy
    },
    { 
      type: 'date_inconsistency', 
      active: false, 
      label: 'Date Inconsistency',
      description: 'Service date appears unusual',
      icon: AlertTriangle
    },
  ];

  const mlFlags = [
    {
      label: 'Isolation Forest Anomaly',
      score: claim.anomaly_score,
      severity: claim.anomaly_score >= 8 ? 'high' : claim.anomaly_score >= 5 ? 'medium' : 'low'
    }
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 border-purple-200 shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-purple-100 p-2 rounded-lg">
          <Brain className="size-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-slate-900">Claim Inspector</h3>
          <p className="text-xs text-slate-500">Rule-based + ML breakdown</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Claim Overview */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-4 text-blue-600" />
            <h4 className="text-sm text-slate-900">Claim Overview</h4>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Claim ID</span>
              <p className="text-slate-900">{claim.claim_id}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Patient ID</span>
              <p className="text-slate-900">{claim.patient_id || 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Provider ID</span>
              <p className="text-slate-900">{claim.provider_id}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Specialty</span>
              <p className="text-slate-900">{claim.specialty}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Amount</span>
              <p className="text-slate-900">${claim.amount.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Claim Status</span>
              <Badge variant={claim.claim_status === 'approved' ? 'default' : 'destructive'}>
                {claim.claim_status}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Date of Service</span>
              <p className="text-slate-900">{claim.date_of_service.split(' ')[0]}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-500">Anomaly Score</span>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs shadow-sm ${
                claim.anomaly_score >= 8 
                  ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                  : claim.anomaly_score >= 5
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {claim.anomaly_score.toFixed(2)}
              </span>
            </div>
          </div>
          {claim.denial_reason && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <span className="text-xs text-slate-500">Denial Reason</span>
              <p className="text-sm text-red-700 mt-1">{claim.denial_reason}</p>
            </div>
          )}
        </div>

        {/* Rule-Based Triggers */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <FileWarning className="size-4 text-orange-600" />
            <h4 className="text-sm text-slate-900">Rule-Based Triggers</h4>
          </div>
          <div className="space-y-2">
            {ruleBasedFlags.map((flag, index) => {
              const Icon = flag.icon;
              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    flag.active 
                      ? 'bg-red-50 border-red-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  {flag.active ? (
                    <XCircle className="size-4 text-red-600 mt-0.5 flex-shrink-0" />
                  ) : (
                    <CheckCircle2 className="size-4 text-gray-400 mt-0.5 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className={`size-3 ${flag.active ? 'text-red-600' : 'text-gray-400'}`} />
                      <p className={`text-sm ${flag.active ? 'text-red-900' : 'text-gray-700'}`}>
                        {flag.label}
                      </p>
                    </div>
                    <p className={`text-xs ${flag.active ? 'text-red-600' : 'text-gray-500'}`}>
                      {flag.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ML Anomaly Flags */}
        <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="size-4 text-purple-600" />
            <h4 className="text-sm text-slate-900">ML Anomaly Detection</h4>
          </div>
          {mlFlags.map((flag, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                flag.severity === 'high' 
                  ? 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200' 
                  : flag.severity === 'medium'
                  ? 'bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200'
                  : 'bg-gradient-to-r from-yellow-50 to-green-50 border-yellow-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-900">{flag.label}</p>
                <Badge 
                  variant={
                    flag.severity === 'high' 
                      ? 'destructive' 
                      : 'default'
                  }
                  className="shadow-sm"
                >
                  {flag.severity.toUpperCase()} • {flag.score.toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className={`size-4 mt-0.5 flex-shrink-0 ${
                  flag.severity === 'high' ? 'text-red-600' : 
                  flag.severity === 'medium' ? 'text-orange-600' : 'text-yellow-600'
                }`} />
                <p className="text-xs text-slate-600">
                  This claim has been flagged by the Isolation Forest algorithm as potentially anomalous based on its features compared to the overall dataset distribution.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}