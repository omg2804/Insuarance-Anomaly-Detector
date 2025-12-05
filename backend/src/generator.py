# src/generator.py
import pandas as pd, numpy as np
from faker import Faker
import random
fake = Faker()

def generate_claims(n=2000, fraud_inject=False):
    rows=[]
    for i in range(n):
        claim_id = f"CLM{100000+i}"
        patient_id = f"PAT{random.randint(1000,9999)}"
        dob = fake.date_of_birth(minimum_age=0, maximum_age=90).isoformat()
        zipc = random.choice([fake.zipcode(), None]) if random.random()<0.05 else fake.zipcode()
        provider_id = f"PRV{random.randint(100,999)}"
        specialty = random.choice(["cardiology","oncology","orthopedics","general"])
        service_code = f"S{random.randint(1000,9999)}"
        diagnosis_code = f"D{random.randint(100,999)}"
        amount = round(abs(np.random.normal(2000, 1500)),2)
        status = random.choices(["approved","denied","pending"], weights=[0.7,0.2,0.1])[0]
        denial_reason = None if status!="denied" else random.choice(["pre-auth missing","non-covered","duplicate"])
        date_of_service = fake.date_between(start_date='-2y', end_date='today').isoformat()
        rows.append([claim_id,patient_id,dob,zipc,provider_id,specialty,service_code,diagnosis_code,amount,status,denial_reason,date_of_service])
    df = pd.DataFrame(rows, columns=["claim_id","patient_id","dob","zip","provider_id","specialty","service_code","diagnosis_code","amount","claim_status","denial_reason","date_of_service"])

    # Inject duplicates and malformed entries
    if n>50:
        dup = df.sample(frac=0.02)
        df = pd.concat([df, dup])
    # inject nulls
    for _ in range(int(n*0.02)):
        idx = np.random.choice(df.index)
        col = random.choice(["zip","dob","patient_id"])
        df.loc[idx, col] = None
    df.to_csv("data/mock_claims.csv", index=False)
    return df

if __name__=="__main__":
    generate_claims(2000)
