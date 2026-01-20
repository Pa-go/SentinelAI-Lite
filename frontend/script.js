/* ==========================================================================
   SENTINEL AI | ELITE NEURAL COMMAND
   Frontend Logic: 3D Visuals + Edge-Heuristics + Data Visualization
   ========================================================================== */

/* --- 3D VISUALS (THREE.JS) --- */
let scene, camera, renderer, coreMesh, particles, rings = [];
let mouseX = 0, mouseY = 0;

// GLOBAL VARIABLES
let currentRiskScore = 0; 
let backendLogs = [];

function init3D() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 3000);
    camera.position.z = 1000;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById('canvas-container');
    if (container) container.appendChild(renderer.domElement);

    const pGeo = new THREE.BufferGeometry();
    const pCount = 2000;
    const pPos = new Float32Array(pCount * 3);
    for(let i=0; i<pCount*3; i++) pPos[i] = (Math.random() - 0.5) * 2000;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x00d4ff, size: 2, transparent: true, opacity: 0.2 }));
    scene.add(particles);

    const coreGeo = new THREE.IcosahedronGeometry(150, 1);
    const coreMat = new THREE.MeshPhongMaterial({ color: 0x00d4ff, wireframe: true, transparent: true, opacity: 0.15 });
    coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    for(let i=0; i<3; i++) {
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(220 + i*50, 0.5, 16, 100),
            new THREE.MeshBasicMaterial({ color: 0x00ff99, transparent: true, opacity: 0.1 })
        );
        ring.rotation.x = Math.random() * Math.PI;
        rings.push(ring);
        scene.add(ring);
    }

    const light = new THREE.PointLight(0x00d4ff, 2, 2000);
    light.position.set(0, 200, 500);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x111111));

    document.addEventListener('mousemove', e => {
        mouseX = (e.clientX - window.innerWidth / 2) / 100;
        mouseY = (e.clientY - window.innerHeight / 2) / 100;
    });

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if(particles) particles.rotation.y += 0.0005;
    if(coreMesh) coreMesh.rotation.y += 0.005;
    rings.forEach((r, i) => r.rotation.z += 0.002 * (i+1));
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

    const interval = setInterval(() => {
        progress += Math.random() * 4;
        if(progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                const intro = document.getElementById('introSec');
                if(intro) {
                    intro.style.opacity = '0';
                    setTimeout(() => {
                        intro.classList.add('hidden');
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
    🚀 THE CONNECTIVITY BRIDGE (EDGE-HEURISTICS)
   ============================================================ */
async function validateLogin() {
    const urlInput = document.getElementById('userInput').value.toLowerCase();
    const btn = document.querySelector('.btn-access');
    const error = document.getElementById('loginError');

    if (!urlInput) {
        if(error) {
            error.innerText = "INPUT REQUIRED";
            error.style.display = "block";
        }
        return;
    }

    btn.innerText = "SCANNING...";
    if(error) error.style.display = "none";

    // Simulating Local AI Processing (No Server Needed)
    setTimeout(() => {
        let score = 12;
        let vector = "TARGET: SECURE_GATEWAY";
        let logs = ["PROTOCOL: HTTPS VERIFIED", "HANDSHAKE: SUCCESS", "STATUS: CLEAN"];

        // Threat Logic
        if (urlInput.includes("admin") || urlInput.includes("root") || urlInput.includes("override")) {
            score = 98;
            vector = "TARGET: ROOT_ACCESS";
            logs = ["ALERT: PRIVILEGED ACCESS ATTEMPT", "FIREWALL: LOCKDOWN", "MITRE ID: T1078"];
        } else if (urlInput.includes("paypal") || urlInput.includes("bank") || urlInput.includes("login")) {
            score = 92;
            vector = "TARGET: PHISHING_PORTAL";
            logs = ["THREAT: KNOWN PHISHING SIGNATURE", "REDIRECT: BLOCKED", "MITRE ID: T1566"];
        } else if (urlInput.length > 150) {
            score = 85;
            vector = "TARGET: MEMORY_STACK";
            logs = ["ANOMALY: OVERFLOW DETECTED", "STATUS: BUFFER_GUARD ACTIVE"];
        }

        const isMalicious = score > 50;
        currentRiskScore = score;

        // Update UI
        document.getElementById('userDisplay').innerText = vector;
        document.getElementById('sysStatus').innerText = `RISK LEVEL: ${score}%`;
        
        const valLoad = document.getElementById('valLoad');
        if(valLoad) valLoad.innerText = isMalicious ? "MALICIOUS" : "NORMAL";

        const valIntegrity = document.querySelector('#integrityCard h2');
        if(valIntegrity) valIntegrity.innerText = isMalicious ? "CRITICAL" : "OPTIMAL";

        // Red Theme for threats
        if(isMalicious) {
            document.documentElement.style.setProperty('--neon-blue', '#ff0055');
            document.documentElement.style.setProperty('--neon-green', '#ff0055');
            document.body.style.animation = "shake 0.5s";
        } else {
            document.documentElement.style.setProperty('--neon-blue', '#00d4ff');
            document.documentElement.style.setProperty('--neon-green', '#00ff99');
        }

        enterDashboard([100-score, score/2, score/2], logs);
    }, 1200);
}

function enterDashboard(pieData, initialLogs) {
    const login = document.getElementById('loginSec');
    const dash = document.getElementById('mainDash');
    
    if(login) login.style.opacity = '0';
    
    setTimeout(() => {
        if(login) login.classList.add('hidden');
        if(dash) {
            dash.style.visibility = 'visible';
            dash.style.opacity = '1';
        }
        
        if(coreMesh) coreMesh.material.opacity = 0.05;
        rings.forEach(r => r.material.opacity = 0.05);
        
        initCharts(pieData); 
        
        const logStream = document.getElementById('logStream');
        if(logStream && initialLogs) {
            initialLogs.forEach(msg => {
                const div = document.createElement('div');
                div.className = 'log-entry alert';
                div.innerHTML = `<span>[ANALYSIS]</span> > ${msg}`;
                logStream.prepend(div);
            });
        }
        
        startDynamicUpdates();
    }, 800);
}

/* --- DASHBOARD LOGIC (Charts & Logs) --- */
let mainChart;

function initCharts(pieData) {
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

    new Chart(document.getElementById('riskChart'), {
        type: 'doughnut',
        data: {
            labels: ['Safe', 'Alert', 'Threat'],
            datasets: [{
                data: pieData || [70, 20, 10],
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

    setInterval(() => {
        const diff = Math.floor((Date.now() - start) / 1000);
        const h = Math.floor(diff / 3600).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600) / 60).toString().padStart(2, '0');
        const s = (diff % 60).toString().padStart(2, '0');
        const uptimeEl = document.getElementById('valUptime');
        if(uptimeEl) uptimeEl.innerText = `${h}:${m}:${s}`;

        let packetVolume = currentRiskScore > 50 ? (50 + Math.random() * 50) : (Math.random() * 15);

        if(mainChart) {
            mainChart.data.datasets[0].data.shift();
            mainChart.data.datasets[0].data.push(packetVolume);
            mainChart.data.datasets[0].borderColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue');
            mainChart.update('none');
        }

        if (Math.random() > 0.8 && logs) {
            const sysEvents = ["Memory sync...", "Packet trace active...", "Neural weights stable..."];
            const e = sysEvents[Math.floor(Math.random()*sysEvents.length)];
            const div = document.createElement('div');
            div.className = 'log-entry';
            div.innerHTML = `<span style="opacity: 0.3">[SYS]</span> > ${e}`;
            logs.prepend(div);
            if(logs.children.length > 15) logs.removeChild(logs.lastChild);
        }
    }, 1000);
}

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