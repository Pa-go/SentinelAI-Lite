print("=== APP.PY IS RUNNING ===")

from flask import Flask, request, jsonify
from datetime import datetime
import pandas as pd
import os

app = Flask(__name__)

AUDIT_LOG_PATH = "data/audit_logs.csv"

# ---------------- SECURITY RULE ENGINE ---------------- #
def apply_security_rules(data):
    triggered_rules = []
    risk_score = 0

    if data["failed_attempts"] >= 5:
        triggered_rules.append("FAILED_LOGIN")
        risk_score += 40

    if data["ip_changed"] == 1:
        triggered_rules.append("IP_CHANGE")
        risk_score += 30

    if data["login_hour"] < 5:
        triggered_rules.append("NIGHT_LOGIN")
        risk_score += 20

    risk_score = min(risk_score, 100)

    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MEDIUM"
    else:
        risk_level = "LOW"

    return risk_level, risk_score, triggered_rules


# ---------------- AUDIT LOGGING ---------------- #
def save_audit_log(record):
    df = pd.DataFrame([record])

    file_exists = os.path.isfile(AUDIT_LOG_PATH)

    df.to_csv(
        AUDIT_LOG_PATH,
        mode="a",
        header=not file_exists,
        index=False
    )


# ---------------- API ENDPOINT ---------------- #
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    risk_level, risk_score, rules_triggered = apply_security_rules(data)

    if risk_level == "LOW":
        ai_label = "NORMAL"
        ai_explanation = "Login behavior appears normal"
    elif risk_level == "MEDIUM":
        ai_label = "SUSPICIOUS"
        ai_explanation = "Unusual login patterns detected"
    else:
        ai_label = "MALICIOUS"
        ai_explanation = "Multiple high-risk login indicators detected"

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    response = {
        "user_id": data["user_id"],
        "risk_level": risk_level,
        "risk_score": risk_score,
        "ai_label": ai_label,
        "ai_explanation": ai_explanation,
        "rule_triggered": rules_triggered,
        "timestamp": timestamp
    }

    # ---- SAVE AUDIT LOG ---- #
    audit_record = {
        "timestamp": timestamp,
        "user_id": data["user_id"],
        "failed_attempts": data["failed_attempts"],
        "ip_changed": data["ip_changed"],
        "login_hour": data["login_hour"],
        "risk_level": risk_level,
        "risk_score": risk_score,
        "ai_label": ai_label,
        "ai_explanation": ai_explanation,
        "rule_triggered": ",".join(rules_triggered)
    }

    save_audit_log(audit_record)

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)
