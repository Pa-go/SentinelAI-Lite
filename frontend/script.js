document.addEventListener("DOMContentLoaded", () => {

    const lock = document.getElementById("dashLock");
    const loginBtn = document.getElementById("loginBtn");

    loginBtn.addEventListener("click", () => {
        lock.classList.add("hidden");         // unlock dashboard
        startCounters();                       // start KPI counters
    });

    /* LINE CHART */
    const ctx1 = document.getElementById("mainChart").getContext("2d");
    const grad = ctx1.createLinearGradient(0,0,0,400);
    grad.addColorStop(0,'rgba(0,212,255,0.4)');
    grad.addColorStop(1,'rgba(0,0,0,0)');

    new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['00:00','04:00','08:00','12:00','16:00','20:00'],
            datasets:[{
                data:[20,45,28,80,40,90],
                borderColor:'#00d4ff',
                backgroundColor:grad,
                fill:true,
                tension:0.4,
                borderWidth:4,
                pointRadius:0
            }]
        },
        options:{
            maintainAspectRatio:false,
            plugins:{ legend:{ display:false } },
            scales:{
                x:{ grid:{ display:false }, ticks:{ color:"#00d4ff" } },
                y:{ grid:{ color:"rgba(255,255,255,0.05)" }, ticks:{ color:"#fff" } }
            }
        }
    });

    /* DONUT CHART */
    new Chart(document.getElementById("riskChart"), {
        type:'doughnut',
        data:{
            labels:['LOW','MEDIUM','HIGH'],
            datasets:[{
                data:[55,25,20],
                backgroundColor:['#00ff9d','#ffd000','#ff004c'],
                borderWidth:2
            }]
        },
        options:{
            maintainAspectRatio:false,
            plugins:{ legend:{ position:'bottom', labels:{ color:'#fff' } } }
        }
    });

    /* KPI COUNTER */
    function startCounters(){
        document.querySelectorAll('.counter').forEach(counter=>{
            const target = +counter.dataset.target;
            let value=0;
            const inc = target/100;
            const update = ()=>{
                if(value<target){
                    value += inc;
                    counter.innerText = Math.ceil(value);
                    setTimeout(update,20);
                } else { counter.innerText = target; }
            };
            update();
        });
    }

});
