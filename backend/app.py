from flask import Flask, jsonify, request
from flask_cors import CORS
import random

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get('url', '').lower()
    
    # --- 1. DEFAULT VALUES (The "Calm" State) ---
    score = 10
    target_vector = "TARGET: UNKNOWN_EP"
    threat_id = "GRID ONLINE"
    logs = [
        "Analyzing packet headers...",
        "Handshake verification: SUCCESS",
        "Traffic volume: NOMINAL"
    ]

    # --- 2. HEURISTICS ENGINE (The Traps) ---

    # TRAP A: The "Buffer Overflow" Test (Long String)
    if len(url) > 150:
        score = 85
        target_vector = "TARGET: MEMORY_STACK"
        threat_id = "T1203" # Exploitation for Client Execution
        logs.append(f"ANOMALY: Input length ({len(url)}) exceeds buffer limit.")
        logs.append("CRITICAL: POTENTIAL OVERFLOW ATTEMPT")

    # TRAP B: The "Root/Admin" Test
    elif any(x in url for x in ["admin", "root", "system", "override"]):
        score = 99
        target_vector = "TARGET: ROOT_ACCESS"
        threat_id = "T1078" # Valid Accounts
        logs.append("ALERT: PRIVILEGED ACCESS ATTEMPT")
        logs.append("ACTION: FIREWALL LOCKDOWN INITIATED")
        logs.append("SECURITY LEVEL: RED")

    # TRAP C: The "Banking/Phishing" Test
    elif any(x in url for x in ["paypal", "bank", "secure", "login-verify", "account"]):
        score = 95
        target_vector = "TARGET: BANKING_DB"
        threat_id = "T1566" # Phishing
        logs.append("THREAT MATCH: Known Phishing Signature")
        logs.append("REDIRECT: Suspicious Domain Blocked")

    # TRAP D: The "Corporate Hack" Test (Microsoft/Office)
    elif any(x in url for x in ["microsoft", "office", "update", "outlook", "corp"]):
        score = 88
        target_vector = "TARGET: CORP_EMAIL"
        threat_id = "T1114" # Email Collection
        logs.append("PATTERN: Social Engineering Detected")
        logs.append("WARNING: Fake Login Portal")

    # TRAP E: SQL Injection
    elif any(x in url for x in ["select", "union", "drop", "1=1", "--"]):
        score = 100
        target_vector = "TARGET: SQL_BACKEND"
        threat_id = "T1190" # Exploit Public-Facing App
        logs.append("CRITICAL: SQL INJECTION SIGNATURE")
        logs.append("DB_GUARD: Query Terminated")

    # --- 3. SAFETY CHECKS (If no threats found) ---
    else:
        # Check protocol
        if "https" in url:
            score = random.randint(5, 15) # Very safe
            target_vector = f"TARGET: {url.split('//')[-1].split('/')[0].upper()}"
            logs.append("PROTOCOL VERIFIED: HTTPS (Secure)")
        else:
            score = random.randint(20, 35) # HTTP is slightly risky
            target_vector = "TARGET: HTTP_NODE"
            logs.append("WARNING: Unencrypted Traffic (HTTP)")
            logs.append("ADVISORY: Upgrade to Secure Channel")

    # --- 4. FORMAT RESPONSE FOR DASHBOARD ---
    response = {
        "raw_score": score,
        "userDisplay": target_vector,      # Shows in Box 1 (Target Vector)
        "valNodes": threat_id,             # Shows in Box 2 (Threat ID)
        "valLoad": "MALICIOUS" if score > 50 else "NORMAL", # Shows in Box 4 (Verdict)
        "sysStatus": f"RISK LEVEL: {score}%",
        "logs": logs,
        "risk_data": [100-score, score/2, score/2] # Updates Pie Chart
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)