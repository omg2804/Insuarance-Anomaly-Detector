# src/anomaly.py

import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest

# --------------------------------------
# RULE-BASED ANOMALY SCORING
# --------------------------------------

def score_rules(df):
    df = df.copy()
    df['anomaly_score'] = 0

    # Missing critical fields
    crit = ['claim_id', 'patient_id', 'dob', 'zip']
    df['missing_crit'] = df[crit].isnull().any(axis=1).astype(int)
    df['anomaly_score'] += df['missing_crit'] * 5

    # Duplicate claim IDs
    df['is_duplicate'] = df.duplicated(subset=['claim_id'], keep=False).astype(int)
    df['anomaly_score'] += df['is_duplicate'] * 5

    # Inconsistent denial rule
    df['denial_inconsistency'] = (
        (df['claim_status'] == 'approved') & (df['denial_reason'].notnull())
    ).astype(int)
    df['anomaly_score'] += df['denial_inconsistency'] * 3

    # Amount rule-based outliers
    amt_mean, amt_std = df['amount'].mean(), df['amount'].std()
    df['amt_outlier'] = (
        (df['amount'] > amt_mean + 4 * amt_std) | (df['amount'] <= 0)
    ).astype(int)
    df['anomaly_score'] += df['amt_outlier'] * 4

    return df


# --------------------------------------
# FEATURE ENGINEERING FOR ML
# --------------------------------------

def prepare_ml_features(df):
    df = df.copy()

    # frequency of claims for each provider
    provider_freq = df['provider_id'].value_counts()
    df['provider_claim_freq'] = df['provider_id'].map(provider_freq)

    # number of past claims per patient
    patient_freq = df['patient_id'].value_counts()
    df['patient_claim_freq'] = df['patient_id'].map(patient_freq)

    # days between dob and service date (age proxy)
    df['days_from_dob'] = (df['date_of_service'] - df['dob']).dt.days
    df['days_from_dob'] = df['days_from_dob'].fillna(df['days_from_dob'].median())

    # encode specialty as ordinal
    specialty_map = {s: i for i, s in enumerate(df['specialty'].unique())}
    df['specialty_code'] = df['specialty'].map(specialty_map)

    # Select final numeric features
    features = [
        'amount',
        'provider_claim_freq',
        'patient_claim_freq',
        'days_from_dob',
        'specialty_code'
    ]

    return df, features


# --------------------------------------
# ML-BASED ISOLATION FOREST DETECTOR
# --------------------------------------

def ml_detector(df):
    df = df.copy()

    # Create ML features
    df, feature_cols = prepare_ml_features(df)

    # Fill NA for model
    X = df[feature_cols].fillna(0)

    # Fit IsolationForest
    model = IsolationForest(
        contamination=0.02,
        random_state=42
    )
    preds = model.fit_predict(X)

    # Add ML scores
    df['iforest_score'] = model.decision_function(X)
    df['iforest_anom'] = (preds == -1).astype(int)

    # Add ML weight to combined anomaly score
    df['anomaly_score'] += df['iforest_anom'] * 3

    # Final anomaly label (tunable threshold)
    df['final_anomaly'] = (df['anomaly_score'] >= 5).astype(int)

    return df
