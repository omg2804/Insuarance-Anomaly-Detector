import { Card } from './ui/card';
import { Shield, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

interface ComplianceScoreProps {
  totalClaims: number;
  totalAnomalies: number;
  duplicates: number;
  missingFields: number;
}

export function ComplianceScore({
  totalClaims,
  totalAnomalies,
  duplicates,
  missingFields
}: ComplianceScoreProps) {
  const complianceChecks = [
    {
      name: 'HIPAA Compliance',
      description: 'Patient data privacy standards',
      passed: missingFields === 0,
      score: missingFields === 0 ? 100 : Math.round((1 - missingFields / totalClaims) * 100),
      critical: true
    },
    {
      name: 'Duplicate Prevention',
      description: 'Claims uniqueness validation',
      passed: duplicates === 0,
      score: duplicates === 0 ? 100 : Math.round((1 - duplicates / totalClaims) * 100),
      critical: false
    },
    {
      name: 'Data Integrity',
      description: 'Anomaly detection threshold',
      passed: totalAnomalies < totalClaims * 0.1,
      score: Math.round((1 - totalAnomalies / totalClaims) * 100),
      critical: true
    },
    {
      name: 'Documentation Standards',
      description: 'Complete field requirements',
      passed: missingFields < 3,
      score: missingFields < 3 ? 95 : 70,
      critical: false
    }
  ];

  const overallScore = Math.round(
    complianceChecks.reduce((sum, check) => sum + check.score, 0) / complianceChecks.length
  );

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-lg">
            <Shield className="size-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-slate-900">Compliance Dashboard</h3>
            <p className="text-xs text-slate-500">Regulatory & standards adherence</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl mb-1 ${
            overallScore >= 90 ? 'text-green-600' :
            overallScore >= 70 ? 'text-orange-600' : 'text-red-600'
          }`}>
            {overallScore}%
          </div>
          <p className="text-xs text-slate-500">Overall Score</p>
        </div>
      </div>

      <div className="space-y-3">
        {complianceChecks.map((check, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border transition-all ${
              check.passed
                ? 'bg-green-50 border-green-200'
                : check.critical
                ? 'bg-red-50 border-red-200'
                : 'bg-orange-50 border-orange-200'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                {check.passed ? (
                  <CheckCircle2 className="size-5 text-green-600 flex-shrink-0 mt-0.5" />
                ) : check.critical ? (
                  <XCircle className="size-5 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className={`text-sm ${
                      check.passed ? 'text-green-900' :
                      check.critical ? 'text-red-900' : 'text-orange-900'
                    }`}>
                      {check.name}
                    </p>
                    {check.critical && (
                      <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded-full">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${
                    check.passed ? 'text-green-700' :
                    check.critical ? 'text-red-700' : 'text-orange-700'
                  }`}>
                    {check.description}
                  </p>
                </div>
              </div>
              <div className={`text-right flex-shrink-0 ml-3`}>
                <p className={`${
                  check.passed ? 'text-green-600' :
                  check.critical ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {check.score}%
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
