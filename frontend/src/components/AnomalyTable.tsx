import { Card } from './ui/card';
import { Button } from './ui/button';
import { Flame, Download, CheckCircle2, Filter, Search } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';

interface Claim {
  claim_id: string;
  patient_id: string | null;
  provider_id: string;
  specialty: string;
  amount: number;
  claim_status: string;
  denial_reason: string | null;
  anomaly_score: number;
}

interface AnomalyTableProps {
  anomalies: Claim[];
  selectedClaimId: string | null;
  onSelectClaim: (claimId: string) => void;
}

export function AnomalyTable({ anomalies, selectedClaimId, onSelectClaim }: AnomalyTableProps) {
  const [showAllRows, setShowAllRows] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const displayedAnomalies = useMemo(() => {
    // Start with all anomalies
    let result = [...anomalies];
    
    // If search term exists, STRICTLY filter to only matching items
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(a => {
        // Check claim_id
        const claimIdMatch = a.claim_id?.toLowerCase().includes(searchLower) ?? false;
        // Check patient_id (handle null)
        const patientIdMatch = a.patient_id ? a.patient_id.toLowerCase().includes(searchLower) : false;
        // Check provider_id
        const providerIdMatch = a.provider_id?.toLowerCase().includes(searchLower) ?? false;
        
        // Only include if at least one field matches
        return claimIdMatch || patientIdMatch || providerIdMatch;
      });
    }
    
    // Sort by anomaly score (highest first)
    result.sort((a, b) => b.anomaly_score - a.anomaly_score);
    
    // Apply limit if checkbox is unchecked
    if (!showAllRows) {
      result = result.slice(0, 10);
    }
    
    return result;
  }, [anomalies, searchTerm, showAllRows]);

  const handleDownload = () => {
    const csvContent = [
      ['claim_id', 'patient_id', 'provider_id', 'specialty', 'amount', 'claim_status', 'denial_reason', 'anomaly_score'].join(','),
      ...anomalies.map(a => [
        a.claim_id,
        a.patient_id,
        a.provider_id,
        a.specialty,
        a.amount,
        a.claim_status,
        a.denial_reason,
        a.anomaly_score
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anomaly_report.csv';
    a.click();
  };

  return (
    <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-orange-50 p-2 rounded-lg">
            <Flame className="size-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-slate-900">Top Anomalies</h3>
            <p className="text-xs text-slate-500">Ranked by anomaly score</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-slate-400" />
          <Input
            placeholder="Search by Claim ID, Patient ID, or Provider..."
            value={searchTerm}
            onChange={(e) => {
              const newValue = e.target.value;
              setSearchTerm(newValue);
            }}
            className="pl-10 bg-white border-slate-200"
          />
        </div>
        
        {searchTerm.trim() && (
          <div className="text-xs text-slate-500 px-1">
            Found {displayedAnomalies.length} result{displayedAnomalies.length !== 1 ? 's' : ''}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <Checkbox
            id="show-all"
            checked={showAllRows}
            onCheckedChange={(checked) => setShowAllRows(checked as boolean)}
          />
          <label htmlFor="show-all" className="text-sm text-slate-600 cursor-pointer">
            Show all matching results (remove 10-item limit)
          </label>
        </div>
      </div>

      <div className="overflow-hidden mb-4 rounded-lg border border-slate-200">
        <div className="max-h-96 overflow-y-auto">
          <table key={`table-${searchTerm}-${displayedAnomalies.length}`} className="w-full">
            <thead className="bg-gradient-to-r from-slate-50 to-slate-100 sticky top-0 z-10">
              <tr>
                <th className="px-3 py-3 text-left text-xs text-slate-600">Claim ID</th>
                <th className="px-3 py-3 text-left text-xs text-slate-600">Patient</th>
                <th className="px-3 py-3 text-left text-xs text-slate-600">Amount</th>
                <th className="px-3 py-3 text-left text-xs text-slate-600">Status</th>
                <th className="px-3 py-3 text-left text-xs text-slate-600">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {displayedAnomalies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-500">
                    {searchTerm.trim() ? (
                      <>No results found for &quot;{searchTerm}&quot;</>
                    ) : (
                      <>No anomalies found</>
                    )}
                  </td>
                </tr>
              ) : (
                displayedAnomalies.map((anomaly, index) => (
                <tr
                  key={`${anomaly.claim_id}-${index}-${anomaly.patient_id || 'na'}`}
                  onClick={() => onSelectClaim(anomaly.claim_id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedClaimId === anomaly.claim_id 
                      ? 'bg-blue-100 shadow-inner' 
                      : 'hover:bg-slate-50'
                  } ${
                    anomaly.anomaly_score >= 8 
                      ? 'border-l-4 border-l-red-500' 
                      : anomaly.anomaly_score >= 5 
                      ? 'border-l-4 border-l-orange-500'
                      : ''
                  }`}
                >
                  <td className="px-3 py-3 text-sm text-slate-900">{anomaly.claim_id}</td>
                  <td className="px-3 py-3 text-sm text-slate-700">{anomaly.patient_id || 'N/A'}</td>
                  <td className="px-3 py-3 text-sm text-slate-900">${anomaly.amount.toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                      anomaly.claim_status === 'approved' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {anomaly.claim_status === 'approved' && <CheckCircle2 className="size-3" />}
                      {anomaly.claim_status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs shadow-sm ${
                      anomaly.anomaly_score >= 8 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' 
                        : anomaly.anomaly_score >= 5
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {anomaly.anomaly_score.toFixed(1)}
                    </span>
                  </td>
                </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleDownload} variant="outline" className="flex-1 hover:bg-blue-50 hover:border-blue-300">
          <Download className="size-4 mr-2" />
          Download Report
        </Button>
        <Button variant="outline" className="hover:bg-slate-50">
          <Filter className="size-4" />
        </Button>
      </div>
    </Card>
  );
}