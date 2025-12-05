# src/etl.py
import pandas as pd

def load_data(path):
    return pd.read_csv(path)

def normalize_df(df):
    df['date_of_service'] = pd.to_datetime(df['date_of_service'], errors='coerce')
    df['dob'] = pd.to_datetime(df['dob'], errors='coerce')
    # standardize zip to string
    df['zip'] = df['zip'].astype('string')
    return df

def find_duplicates(df):
    dup = df[df.duplicated(subset=['claim_id'], keep=False)]
    return dup

def missing_summary(df):
    return df.isnull().sum().reset_index().rename(columns={'index':'col',0:'missing_count'})
