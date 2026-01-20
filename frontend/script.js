/* ==========================================================================
   SENTINEL AI | ELITE NEURAL COMMAND
   Frontend Logic: 3D Visuals + Backend Bridge + Data Visualization
   ========================================================================== */

/* --- 3D VISUALS (THREE.JS) --- */
let scene, camera, renderer, coreMesh, particles, rings = [];
let mouseX = 0, mouseY = 0;

// GLOBAL VARIABLES FOR REAL DATA
let currentRiskScore = 0; 
let backendLogs = [];

/* Initialize the 3D Background */
function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Attach to the container in the new HTML
    const container = document.getElementById('canvas-container');
    if (container) container.appendChild(renderer.domElement);

    // Particles
    const pGeo = new THREE.BufferGeometry();
    const pCount = 2000;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 2000;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00d4ff, size: 2, transparent: true, opacity: 0.2 }));
    scene.add(particles);

    // Central Core
    const coreGeo = new THREE.IcosahedronGeometry(150, 1);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.15 });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Orbiting Rings
    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(220 + i*50, 0.5, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0x00ff99, transparent: true, opacity: 0.1 })
        );
        ring.rotation.x = Math.random() * Math.PI;
        rings.push(ring);
        scene.add(ring);
    }

    // Lighting
    const light = new THREE.PointLight(0x00d4ff, 2, 2000);
    light.position.set(0, 200, 500);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111111));

    // Mouse Interaction
    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX - window.innerWidth / 2) / 100;
        mouseY = (e.clientY - window.innerHeight / 2) / 100;
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    
    // Rotate elements
    if(particles) particles.rotation.y += 0.0005;
    if(coreMesh) coreMesh.rotation.y += 0.005;
    rings.forEach((r, i) => r.rotation.z += 0.002 * (i+1));
    
    // Mouse parallax
    if(scene) {
        scene.rotation.x += (mouseY * 0.01 - scene.rotation.x) * 0.05;
        scene.rotation.y += (mouseX * 0.01 - scene.rotation.y) * 0.05;
    }
    
    renderer.render(scene, camera);
}

/* --- PAGE LOAD SEQUENCE --- */
window.addEventListener('load', () => {
    init3D();
    generateMatrixEffect();
    
    let progress = 0;
    const bar = document.getElementById('load-bar');
    const status = document.getElementById('loadStatus');
    const percent = document.getElementById('loadPercent');
    const steps = ["HANDSHAKE...", "BYPASSING FIREWALL...", "DECRYPTING...", "SYNCING..."];

    // Simulated Loading Bar
    const interval = setInterval(() => {
        progress += Math.random() * 4;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                // Fade out intro
                const intro = document.getElementById('introSec');
                if(intro) {
                    intro.style.opacity = '0';
                    setTimeout(() => {
                        intro.classList.add('hidden');
                        // Fade in Login
                        const login = document.getElementById('loginSec');
                        if(login) {
                            login.style.opacity = '1';
                            login.style.pointerEvents = 'auto';
                        }
                    }, 1000);
                }
            }, 500);
        }
        if(bar) bar.style.width = progress + '%';
        if(percent) percent.innerText = Math.floor(progress) + '%';
        if(status) status.innerText = steps[Math.floor(progress/26)] || "ACCESSING GATEWAY...";
    }, 50);
});

function generateMatrixEffect() {
    const container = document.getElementById('introData');
    if(!container) return;
    const chars = "0101XYZ{}[]<>/\\$#@!*";
    setInterval(() => {
        let str = "";
        for(let i=0; i<1000; i++) str += chars[Math.floor(Math.random()*chars.length)] + (i%50===0?"\n":"");
        container.innerText = str;
    }, 100);
}

/* ============================================================
   🚀 THE CONNECTIVITY BRIDGE (HIJACKED LOGIN)
   ============================================================ */
async function validateLogin() {
    const urlInput = document.getElementById('userInput').value; // Using User ID box as URL Input
    const error = document.getElementById('loginError');
    const btn = document.querySelector('.btn-access');

    // Basic Validation
    if (!urlInput) {
        if(error) {
            error.innerText = "INPUT REQUIRED";
            error.style.display = "block";
        }
        return;
    }

    // Visual Feedback
    if(btn) btn.innerText = "SCANNING...";
    if(error) error.style.display = "none";

    try {
        // 1. CONNECT TO PYTHON BACKEND
        // Ensure app.py is running on port 5000
        const response = await fetch("http://127.0.0.1:5000/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: urlInput })
        });

        if (!response.ok) throw new Error("Backend connection failed");

        const data = await response.json();

        // 2. STORE DATA GLOBALLY
        currentRiskScore = data.raw_score;
        backendLogs = data.logs;

        // 3. INJECT DATA INTO DASHBOARD (Before it opens)
        
        // Header
        const userDisplay = document.getElementById('userDisplay');
        if(userDisplay) userDisplay.innerText = data.userDisplay;
        
        const sysStatus = document.getElementById('sysStatus');
        if(sysStatus) sysStatus.innerText = data.sysStatus;

        // KPI Cards
        const valLoad = document.getElementById('valLoad');
        if(valLoad) valLoad.innerText = data.valLoad; // Shows "NORMAL" or "MALICIOUS"
        
        const valNodes = document.getElementById('valNodes');
        if(valNodes) valNodes.innerText = data.valNodes; // Shows MITRE ID

        // Integrity Card (Fix: Selecting H2 inside the card)
        const valIntegrity = document.querySelector('#integrityCard h2');
        if(valIntegrity) valIntegrity.innerText = data.valIntegrity; // Shows "OPTIMAL" or "CRITICAL"

        // 4. CHANGE THEME IF MALICIOUS (Red Alert)
        if(data.raw_score > 50) {
            document.documentElement.style.setProperty('--neon-blue', '#ff0055');
            document.documentElement.style.setProperty('--neon-green', '#ff0055');
            // Flash the dashboard red
            document.body.style.animation = "shake 0.5s";
        } else {
            // Reset to Blue/Green if safe (for subsequent scans)
            document.documentElement.style.setProperty('--neon-blue', '#00d4ff');
            document.documentElement.style.setProperty('--neon-green', '#00ff99');
        }

        // 5. OPEN DASHBOARD
        enterDashboard(data.risk_data);

    } catch (err) {
        console.error(err);
        if(error) {
            error.innerText = "SERVER CONNECTION FAILED";
            error.style.display = "block";
        }
        if(btn) btn.innerText = "RETRY";
    }
}

function enterDashboard(pieData) {
    const login = document.getElementById('loginSec');
    const dash = document.getElementById('mainDash');
    
    if(login) login.style.opacity = '0';
    
    setTimeout(() => {
        if(login) login.classList.add('hidden');
        if(dash) {
            dash.style.visibility = 'visible';
            dash.style.opacity = '1';
        }
        
        // Fade out the 3D background slightly so text is readable
        if(coreMesh) coreMesh.material.opacity = 0.05;
        rings.forEach(r => r.material.opacity = 0.05);
        
        initCharts(pieData); // Pass real data to charts
        startDynamicUpdates();
    }, 800);
}

/* --- DASHBOARD LOGIC (Charts & Logs) --- */
let mainChart;

function initCharts(pieData) {
    // 1. LINE CHART (Timeline / Activity)
    const ctx = document.getElementById('mainChart').getContext('2d');
    const chartColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue').trim();

    mainChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                data: Array(20).fill(0).map(() => Math.random() * 10),
                borderColor: chartColor,
                backgroundColor: 'rgba(0, 212, 255, 0.05)',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { 
                x: { display: false }, 
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, max: 100, min: 0 } 
            },
            animation: false
        }
    });

    // 2. PIE CHART (Risk Analysis) - NOW REAL
    new Chart(document.getElementById('riskChart'), {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Alert', 'Threat'],
            datasets: [{
                data: pieData || [70, 20, 10], // Use Python data
                backgroundColor: ['#00ff99', '#f1c40f', '#ff0055'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            cutout: '80%'
        }
    });
}

function startDynamicUpdates() {
    const logs = document.getElementById('logStream');
    const start = Date.now();

    // 1. PRINT PYTHON LOGS IMMEDIATELY
    if (backendLogs && backendLogs.length > 0) {
        backendLogs.forEach(log => {
            const div = document.createElement('div');
            div.className = 'log-entry alert';
            div.innerHTML = `<span style="opacity: 0.5">[ANALYSIS]</span> > ${log}`;
            logs.appendChild(div);
        });
    }

    setInterval(() => {
        // Uptime Timer
        const diff = Math.floor((Date.now() - start) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        const uptimeEl = document.getElementById('valUptime');
        if(uptimeEl) uptimeEl.innerText = `${h}:${m}:${s}`;

        // GRAPH ANIMATION LOGIC (The Heartbeat)
        let packetVolume;
        if (currentRiskScore > 50) {
            // High Threat = High Spikes (Chaos)
            packetVolume = 50 + Math.random() * 50; 
        } else {
            // Low Threat = Flatline (Calm)
            packetVolume = Math.random() * 15;
        }

        if(mainChart) {
            mainChart.data.datasets[0].data.shift();
            mainChart.data.datasets[0].data.push(packetVolume);
            
            // Sync Color in case it changed to Red
            mainChart.data.datasets[0].borderColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue');
            mainChart.update('none');
        }

        // Random simulated system logs (just for effect)
        if (Math.random() > 0.9 && logs) {
            const sysEvents = ["Memory sync...", "Packet trace active...", "Neural weights stable..."];
            const e = sysEvents[Math.floor(Math.random()*sysEvents.length)];
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = `<span style="opacity: 0.3">[SYS]</span> > ${e}`;
            logs.prepend(div);
            // Limit log history
            if(logs.children.length > 20) logs.removeChild(logs.lastChild);
        }

    }, 1000);
}

// Module Toggle Function (for the buttons)
function toggleModule(btn) {
    btn.classList.toggle('active');
    const moduleName = btn.innerText;
    const status = btn.classList.contains('active') ? "ENABLED" : "DISABLED";
    
    const logs = document.getElementById('logStream');
    if(logs) {
        const div = document.createElement('div');
        div.className = 'log-entry ' + (status === "ENABLED" ? "success" : "alert");
        div.innerHTML = `<span style="opacity: 0.3">[SYS]</span> > MODULE ${moduleName}: ${status}`;
        logs.prepend(div);
    }
}