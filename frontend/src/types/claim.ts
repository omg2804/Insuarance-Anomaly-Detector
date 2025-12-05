// TypeScript interfaces matching backend response
// Backend returns DataFrame with these fields after ETL + anomaly detection

export interface ClaimData {
  // Original CSV fields
  claim_id: string;
  patient_id: string | null;
  dob: string | null;
  zip: string | null;
  provider_id: string;
  specialty: string;
  service_code: string | null;
  diagnosis_code: string | null;
  amount: number;
  claim_status: string;
  denial_reason: string | null;
  date_of_service: string;
  
  // Anomaly detection fields (added by backend)
  anomaly_score: number;
  missing_crit: number; // 0 or 1
  is_duplicate: number; // 0 or 1
  denial_inconsistency?: number; // 0 or 1
  amt_outlier?: number; // 0 or 1
  iforest_score?: number;
  iforest_anom?: number; // 0 or 1
  final_anomaly?: number; // 0 or 1
  
  // ML feature fields (may be present)
  provider_claim_freq?: number;
  patient_claim_freq?: number;
  days_from_dob?: number;
  specialty_code?: number;
}

// Transformed claim with boolean fields for UI components
export interface TransformedClaim extends Omit<ClaimData, 'is_duplicate' | 'missing_crit'> {
  is_duplicate: boolean;
  missing_critical: boolean;
}

// Helper type guards
export function isDuplicate(claim: ClaimData): boolean {
  return claim.is_duplicate === 1;
}

export function hasMissingCritical(claim: ClaimData): boolean {
  return claim.missing_crit === 1;
}

// Transform backend data to UI format
export function transformClaim(claim: ClaimData): TransformedClaim {
  return {
    ...claim,
    is_duplicate: isDuplicate(claim),
    missing_critical: hasMissingCritical(claim),
  };
}

