import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
import os

DATA_PATH = "backend/data/login_logs.csv"
MODEL_PATH = "backend/model.pkl"

def train_model():
    df = pd.read_csv(DATA_PATH)

    X = df[["failed_attempts", "ip_changed", "login_hour"]]
    y = df["is_malicious"]

    model = LogisticRegression()
    model.fit(X, y)

    joblib.dump(model, MODEL_PATH)
    return model

def load_model():
    if not os.path.exists(MODEL_PATH):
        return train_model()
    return joblib.load(MODEL_PATH)

def get_ai_result(failed_attempts, ip_changed, login_hour):
    model = load_model()

    # Create DataFrame input (clean & warning-free)
    features = pd.DataFrame(
        [[failed_attempts, ip_changed, login_hour]],
        columns=["failed_attempts", "ip_changed", "login_hour"]
    )

    # AI prediction
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0][1]

    ai_label = "MALICIOUS" if prediction == 1 else "NORMAL"
    risk_score = int(probability * 100)

    # Explanation logic (Explainable AI)
    explanations = []

    if failed_attempts >= 5:
        explanations.append("Multiple failed login attempts")
    if ip_changed == 1:
        explanations.append("IP address changed")
    if login_hour < 5:
        explanations.append("Unusual login time")

    if not explanations:
        explanations.append("Login behavior appears normal")

    ai_explanation = ", ".join(explanations)

    return {
        "ai_label": ai_label,
        "risk_score": risk_score,
        "ai_explanation": ai_explanation
    }

# Local test
if __name__ == "__main__":
    result = get_ai_result(6, 1, 2)
    print(result)
