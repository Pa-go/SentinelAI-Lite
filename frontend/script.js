/* ===================== DASHBOARD UNLOCK ===================== */
function handleLogin() {
  // Unlock dashboard
  document.getElementById("dashLock").style.display = "none";

  // Simulated login behavior (demo purpose)
  const payload = {
    failed_attempts: Math.floor(Math.random() * 7),
    ip_changed: Math.random() > 0.5 ? 1 : 0,
    login_hour: new Date().getHours()
  };

  logToTerminal(`INPUT → Failed:${payload.failed_attempts}, IP Change:${payload.ip_changed}`);

  sendLoginData(payload);
}

/* ===================== BACKEND COMMUNICATION ===================== */
async function sendLoginData(payload) {
  try {
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    logAIResult(result);

  } catch (error) {
    logToTerminal("SYSTEM ERROR: Backend not reachable", "error");
  }
}

/* ===================== TERMINAL OUTPUT ===================== */
function logAIResult(result) {
  const type = result.ai_label === "MALICIOUS" ? "error" : "success";

  logToTerminal(`AI LABEL → ${result.ai_label}`, type);
  logToTerminal(`RISK SCORE → ${result.risk_score}%`);
  logToTerminal(`INFO → ${result.ai_explanation}`);
  logToTerminal("────────────────────────────────");
}

function logToTerminal(message, type = "") {
  const logStream = document.getElementById("logStream");
  const time = new Date().toLocaleTimeString();

  const p = document.createElement("p");
  if (type) p.classList.add(type);

  p.innerHTML = `<span>[${time}]</span> > ${message}`;
  logStream.appendChild(p);
  logStream.scrollTop = logStream.scrollHeight;
}

/* ===================== CHARTS INITIALIZATION ===================== */
document.addEventListener("DOMContentLoaded", () => {
  initMainChart();
  initRiskChart();
});

/* ===================== LINE CHART ===================== */
function initMainChart() {
  const ctx = document.getElementById("mainChart").getContext("2d");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
      datasets: [{
        label: "Neural Activity",
        data: [20, 45, 28, 80, 40, 90],
        borderColor: "#00e5ff",
        backgroundColor: "rgba(0,229,255,0.15)",
        fill: true,
        tension: 0.4,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { grid: { color: "rgba(255,255,255,0.05)" } },
        y: { grid: { color: "rgba(255,255,255,0.05)" } }
      }
    }
  });
}

/* ===================== PIE / DONUT CHART ===================== */
function initRiskChart() {
  const ctx = document.getElementById("riskChart").getContext("2d");

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["LOW", "MEDIUM", "HIGH"],
      datasets: [{
        data: [55, 25, 20],
        backgroundColor: ["#00ff9c", "#ffd000", "#ff0055"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { color: "#ffffff" }
        }
      }
    }
  });
}
