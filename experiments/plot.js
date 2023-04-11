const ctx = document.getElementById('myChart');
const PLOT = new Chart(ctx, {
    type: 'violin',
    data: {
        labels: [],
        datasets: [{
            label: 'Speed',
            data: [],
            yAxisID: 'y2'
        },{
            label: 'Error',
            data: [],
            yAxisID: 'y2'
        },{
            label: 'Polarisation',
            data: [],
            yAxisID: 'y1'
        },{
            label: 'Angular Momentum',
            data: [],
            yAxisID: 'y1'
        },]
    },
    options: {
        scales: {
            y1: {
                beginAtZero: true
            },
            y2: {
                beginAtZero: true,
                position: "right"
            }
        }
    }
}); 