-m# SentinelAI-Lite
AI-Powered Cyber Threat Analysis & Simulation Platform
SentinelAI-Lite is a cybersecurity analysis dashboard that simulates how modern Security Operations Centers (SOC) analyze suspicious inputs using AI-driven risk scoring, heuristic detection, and explainable outputs.
The system takes a real-world style input (URL / source link) and evaluates it using multiple security indicators, producing:
Threat verdict
Risk score
Human-readable explanation
Simulated firewall & SOC response
Visual analytics (charts, logs, telemetry)

Key Features
AI-Inspired Threat Analysis
Heuristic-based detection (phishing, SQL injection, admin abuse, overflow patterns)
Risk score generation (0–100%)
Verdict classification: NORMAL / MALICIOUS

Explainable Security Output
Human-readable explanation of detected behavior
Triggered indicators (IOC-style)
MITRE-mapped threat IDs (simulated)

Simulated SOC & Firewall Response
Firewall lockdown / isolation logic
Recommended security actions
Visual alert escalation (green → red)

Real-Time Dashboard
Neural activity line graph
Risk distribution pie chart
Encrypted system logs
Session timer & dynamic telemetry
Interactive control modules

Advanced Cyber UI
Futuristic SOC-style dashboard
Three.js 3D visuals
Dynamic theme switching based on threat level

Project Architecture

SentinelAI-Lite/
│
├── backend/
│   ├── app.py                 # Flask API (AI + Heuristics Engine)
│   └── data/                  # (Optional) datasets / logs
│
├── frontend/
│   ├── index.html             # Cyber dashboard UI
│   ├── script.js              # Frontend logic & backend integration
│   └── style.css              # UI styling
│
├── README.md
└── .gitignore


How It Works (Flow)

1. User enters a URL / source link
2. Frontend sends input to Flask backend
3. Backend analyzes input using:
Pattern detection
Length & keyword heuristics
Protocol validation
4. Backend returns:
Risk score
Threat verdict
Logs & indicators
5. Frontend visualizes:
Charts
Logs
SOC responses
Security status

Tech Stack
Backend
Python
Flask
Flask-CORS

Frontend
HTML, Tailwind CSS, JavaScript
Chart.js (graphs)
Three.js (3D visuals)

AI / Security Logic
Rule-based heuristic engine
Risk scoring model
Explainable outputs (non-black-box)


Running the Project
🔹 Prerequisites
Python 3.9+

Web browser (Chrome / Edge recommended)

Option 1: Run with Virtual Environment (Recommended)

python -m venv venv
venv\Scripts\activate

pip install flask flask-cors
python backend/app.py

Then open:
frontend/index.html

Option 2: Run Without Virtual Environment

pip install flask flask-cors
python backend/app.py

Then open:
frontend/index.html
Virtual environment is optional.
SentinelAI runs on any system with Python installed.


Security & Privacy Note
No real emails, passwords, or credentials are used
No connection to Google, Microsoft, or external cloud accounts
All detections are simulated & educational
Designed for hackathon demo and learning

Hackathon Scope (Round-1)

✔ AI-based risk analysis
✔ Explainable cybersecurity logic
✔ Frontend-backend integration
✔ SOC simulation
✔ Visual analytics

Future enhancements (beyond Round-1):
Real threat intelligence feeds
ML-trained models
Database-backed event storage
Authentication integration


Team Contribution Overview

AI / Security Logic: Risk scoring, heuristics, explainability
Backend: Flask API, detection engine
Frontend: Cyber dashboard, charts, visualization
Integration: Real-time data flow & SOC simulation

Final Note
SentinelAI-Lite demonstrates how AI can assist cybersecurity analysts by:
Reducing alert fatigue
Providing explainable insights
Supporting faster decision-making


This project focuses on clarity, realism, and usability rather than unsafe real-world access.
