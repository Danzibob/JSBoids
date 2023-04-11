class ExperimentRunner{
    constructor(){
        // Start web worker
        this.thread = new Worker("/worker.js");
        this.working = false
        this.thread.onmessage = (e) => {
            const msg = e.data
            if("DONE" in msg){
                this.working = false
                console.log(msg.took)
                return
            }
            for(let i=0; i<this.labels.length; i++){
                const k = this.labels[i]
                this.data[k][msg.sample] = msg[k]
                this.record_count = msg.sample
            }
        }
    }

    init_storage(num_samples, data_labels){
        this.data = {}
        this.labels = data_labels
        this.max_samples = num_samples
        for(const label of data_labels){
            const buff = new ArrayBuffer(4*num_samples)
            this.data[label] = new Float32Array(buff)
        }
        this.record_count = 0
    }

    run(num_ticks, sample_period, config){
        if(this.working){
            console.error("Runner is busy!")
            return
        }
        let num_samples = Math.ceil(num_ticks / sample_period)
        if(num_samples > this.max_samples){
            console.warn(`Too many samples for data buffer (${num_samples} > ${this.max_samples}). Will stop at limit.`)
            num_ticks = this.max_samples * sample_period - 1
        }
        config.period = sample_period
        config.ticks = num_ticks
        this.thread.postMessage(config)
        this.working = true
    }
}

const runners = []
let BASE_EXPERIMENT = {width:1000, height:1000, num_boids: 20}
let EXPERIMENTS = [
    {message_chance: 1, stale: 1},
    {message_chance: 0.05, stale: 1},
    {message_chance: 0.01, stale: 1},
    {message_chance: 1, stale: 20},
    {message_chance: 0.05, stale: 20},
    {message_chance: 0.01, stale: 20},
]

const NUM_EXPERIMENTS = EXPERIMENTS.length || 4
 
const LABELS = ["speed", "error", "polarisation", "angular_momentum"]
for(let d=0; d<LABELS.length; d++){
    for(let i=0; i<NUM_EXPERIMENTS; i++)
        PLOT.data.datasets[d].data.push([])
} 
for(let i=0; i<NUM_EXPERIMENTS; i++){
    PLOT.data.labels.push(`Experiment ${i}`)
    const runner = new ExperimentRunner()
    runner.init_storage(5000, LABELS)
    runner.run(100000, 20, {...BASE_EXPERIMENT, ...EXPERIMENTS[i]})
    runners.push(runner)
} 

let interval = setInterval(() => {
    let working = false
    for(let i=0; i<NUM_EXPERIMENTS; i++){
        working |= runners[i].working
        for(let d=0; d<LABELS.length; d++){
            PLOT.data.datasets[d].data[i] = [...runners[i].data[LABELS[d]]].slice(0,runners[i].record_count)
        }
    }
    PLOT.update()
    if(!working){
        console.log("All runners complete!")
        clearInterval(interval)
    }
}, 1000) 