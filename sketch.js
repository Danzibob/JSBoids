
// Chance for an agent to send a message update per simulation tick
var MESSAGE_CHANCE = 0.1;
// Simulation ticks for a knowledge store item to go stale
var STALE = 60; 
var DETECTION_TIMEOUT = 120;

var NUM_BOIDS = 60;

var SIMULATION_SPEED = 2; 

let flock;
let field;
var SCALE = 0.1;
var FPV_SCALE = 0.7;

function setup() {
  createCanvas(400, 800);
  colorMode(HSB, 1, 1, 255, 1);
  height = height/2;

  field = new MineField(width/SCALE, height/SCALE, 4)

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < NUM_BOIDS; i++) {
    let b = new Boid(Math.random() * 100,Math.random() * 100);
    flock.addBoid(b);
  }
  flock.boids[0].r = 8;
}

function draw() {
  // Draw Lower Background
  noStroke()
  fill(51)
  rect(0,height,width, height)

  // Draw world from perspective of boid[0]
  flock.boids[0].render_forces = true;
  push()
  translate(width/2,height*1.5);
  // scale(width / (EXPLORING.comms*2))
  scale(FPV_SCALE)
  translate(-flock.boids[0].position.x,-flock.boids[0].position.y)
  for(let b of flock.boids){
    // if(dist(b.position.x, b.position.y, flock.boids[0].position.x,flock.boids[0].position.y) < width/4){
      b.render(flock.boids, 1, 0.1)
    // }
  }
  pop()


  // Draw Upper Background
  noStroke()
  fill(0,1)
  rect(0,0,width, height)
  scale(SCALE)
  field.display()

  // Run & draw flocking simulation
  flock.boids[0].render_forces = false; // Config for rendering
  for(let i=0; i<SIMULATION_SPEED; i++){
    flock.run(field)
  };

  // Log stats
  // if(frameCount % 10 == 0 && frameCount/60 < 60){
  //   const stats = flock.stats()
  //   PLOT.data.labels.push(frameCount/60)
  //   // PLOT.data.datasets[0].data.push(stats.polarisation + stats.angular_momentum)
  //   PLOT.data.datasets[1].data.push(stats.polarisation)
  //   PLOT.data.datasets[2].data.push(stats.angular_momentum)
  //   PLOT.data.datasets[3].data.push(stats.error)
  //   PLOT.data.datasets[5].data.push(stats.speed)
  //   PLOT.update();
  // }

  // noLoop()
 
}
