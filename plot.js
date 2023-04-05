const ctx = document.getElementById('myChart');
const PLOT = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Mines Found',
            data: [],
            borderWidth: 1,
            pointRadius: 0
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true,
            min: 0,
            max: 120
        },
        x: {
            type: "linear"
        }
        }
    }
});