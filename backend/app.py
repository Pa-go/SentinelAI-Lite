from flask import Flask, request, jsonify
from flask_cors import CORS

# Import AI model function
from model import get_ai_result

app = Flask(__name__)
CORS(app)  # allow frontend to talk to backend

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Extract login behavior features
    failed_attempts = data.get("failed_attempts", 0)
    ip_changed = data.get("ip_changed", 0)
    login_hour = data.get("login_hour", 12)

    # Call AI model
    ai_result = get_ai_result(
        failed_attempts,
        ip_changed,
        login_hour
    )

    return jsonify(ai_result)

@app.route("/")
def home():
    return jsonify({"status": "SentinelAI backend running"})

if __name__ == "__main__":
    app.run(debug=True)
