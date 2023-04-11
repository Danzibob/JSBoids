// Web worker to run simulation in background and report results
var width
var height
var MESSAGE_CHANCE
var NUM_BOIDS
var STALE
var SCALE

importScripts("lib/p5.Vector.js","sketch.js", "boid.js", "flock.js")

onmessage = (e) => {
    const START_TIME = new Date()
    const msg = e.data
    width = msg.width
    height = msg.height
    // Consistent defaults
    MESSAGE_CHANCE = msg.message_chance || 0.1
    NUM_BOIDS = msg.num_boids || 64
    STALE = msg.stale || 1
    SCALE = msg.scale || 1

    const SAMPLE_PERIOD = msg.period || 10
    const TICKS = msg.ticks || 10000

    // Create a new flock object
    const flock = new Flock()
    // Add an initial set of boids into the system
    for (let i = 0; i < NUM_BOIDS; i++) {
        // Boids are 
        let b = new Boid(Math.random() * 100,Math.random() * 100)
        flock.addBoid(b)
    }

    // Run simulation
    let sample = 0
    for(let i=0; i<TICKS; i++){
        flock.run(undefined, undefined, false)
        if(i % SAMPLE_PERIOD == 0){
            const stats = flock.stats()
            stats.tick = i
            stats.sample = sample++
            postMessage(stats)
        }
    }

    postMessage({
        DONE: true,
        took: (new Date() - START_TIME)/1000
    })
}
