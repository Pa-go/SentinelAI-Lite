async function sendLoginData() {
  const payload = {
    failed_attempts: 6,
    ip_changed: 1,
    login_hour: 2
  };

  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    document.getElementById("ai-label").innerText = result.ai_label;
    document.getElementById("risk-score").innerText = result.risk_score + "%";
    document.getElementById("ai-explanation").innerText = result.ai_explanation;

  } catch (error) {
    console.error("Backend connection failed:", error);
  }
}

sendLoginData();
