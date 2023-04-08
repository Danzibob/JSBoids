const ctx = document.getElementById('myChart');
const PLOT = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Mines Found',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y'
        },{
            label: 'Polarisation',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y'
        },{
            label: 'Angular Momentum',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y'
        },{
            label: 'Error',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y1'
        },{
            label: 'Separation',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y1'
        },{
            label: 'Speed',
            data: [],
            borderWidth: 1,
            pointRadius: 0,
            yAxisID: 'y1'
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: true
        },
        y1: {
            beginAtZero: true,
            position: "right"
        },
        x: {
            type: "linear"
        }
        }
    }
});