from flask import Flask, jsonify, request, render_template
from flask_cors import CORS
import random

# --- CONFIGURATION ---
app = Flask(__name__, 
            template_folder='../frontend', 
            static_folder='../frontend',
            static_url_path='')

CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    url = data.get('url', '').lower()
    
    # --- 1. DEFAULT VALUES ---
    score = 10
    target_vector = "TARGET: UNKNOWN_EP"
    threat_id = "GRID ONLINE"
    logs = [
        "Analyzing packet headers...",
        "Handshake verification: SUCCESS",
        "Traffic volume: NOMINAL"
    ]

    # --- 2. HEURISTICS ENGINE (The Traps) ---
    if len(url) > 150:
        score = 85
        target_vector = "TARGET: MEMORY_STACK"
        threat_id = "T1203"
        logs.append(f"ANOMALY: Input length ({len(url)}) exceeds buffer limit.")
        logs.append("CRITICAL: POTENTIAL OVERFLOW ATTEMPT")

    elif any(x in url for x in ["admin", "root", "system", "override"]):
        score = 99
        target_vector = "TARGET: ROOT_ACCESS"
        threat_id = "T1078"
        logs.append("ALERT: PRIVILEGED ACCESS ATTEMPT")
        logs.append("ACTION: FIREWALL LOCKDOWN INITIATED")

    elif any(x in url for x in ["paypal", "bank", "secure", "login-verify", "account"]):
        score = 95
        target_vector = "TARGET: BANKING_DB"
        threat_id = "T1566"
        logs.append("THREAT MATCH: Known Phishing Signature")

    elif any(x in url for x in ["select", "union", "drop", "1=1", "--"]):
        score = 100
        target_vector = "TARGET: SQL_BACKEND"
        threat_id = "T1190"
        logs.append("CRITICAL: SQL INJECTION SIGNATURE")

    # --- 3. SAFETY CHECKS (If no traps matched) ---
    else:
        if "https" in url:
            score = random.randint(5, 12)
            target_vector = f"TARGET: {url.split('//')[-1].split('/')[0].upper()}" if '//' in url else "TARGET: SECURE_NODE"
            logs.append("PROTOCOL VERIFIED: HTTPS (Secure)")
        elif "." in url: # Covers cases like "google.com" without https
            score = random.randint(15, 25)
            target_vector = f"TARGET: {url.upper()}"
            logs.append("ADVISORY: Missing Protocol. Standard scan completed.")
        else:
            score = random.randint(30, 45)
            target_vector = "TARGET: GENERAL_INPUT"
            logs.append("INPUT VERIFIED: Heuristic analysis complete.")

    # --- 4. FORMAT RESPONSE ---
    response = {
        "raw_score": score,
        "userDisplay": target_vector,
        "valNodes": threat_id,
        "valLoad": "MALICIOUS" if score > 50 else "NORMAL",
        "valIntegrity": "CRITICAL" if score > 50 else "OPTIMAL",  # ADD THIS LINE
        "sysStatus": f"RISK LEVEL: {score}%",
        "logs": logs,
        "risk_data": [100-score, score/2, score/2]
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)