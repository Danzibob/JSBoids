
// Chance for an agent to send a message update per simulation tick
const MESSAGE_CHANCE = 0.1;
// Simulation ticks for a knowledge store item to go stale
const STALE = 20;
const DETECTION_TIMEOUT = 120;

const NUM_BOIDS = 30 ;

const SIMULATION_SPEED = 1;

let flock;
let field;
const SCALE = 0.3;
const FPV_SCALE = 1;

function setup() {
  createCanvas(360, 720);
  colorMode(HSB, 1, 1, 255, 1);
  height = 360;

  field = new MineField(width/SCALE, height/SCALE, 3)

  flock = new Flock();
  // Add an initial set of boids into the system
  for (let i = 0; i < NUM_BOIDS; i++) {
    let b = new Boid(Math.random() * width/SCALE,Math.random() * height/SCALE);
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
    if(dist(b.position.x, b.position.y, flock.boids[0].position.x,flock.boids[0].position.y) < width/4){
      b.render(flock.boids, 1, 0.5)
    }
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
  if(frameCount % 10 == 0 && field.found < field.mines.length){
    PLOT.data.labels.push(frameCount/60)
    PLOT.data.datasets[0].data.push(field.found)
    PLOT.update();
  }
 
}

class Flock {
  boidID = 0; // boid ID counter

  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
  }

  // Manage flock simulation and rendering
  run(field, opacity){
    // Simulate stochastic async message passing
    for (let i = 0; i < this.boids.length; i++) {
      if(Math.random() < MESSAGE_CHANCE){
        for (let j = 0; j < this.boids.length; j++) {
          if(j != i) this.boids[j].receive(this.boids[i])
        }
      }
    }

    // Perform flocking calculations for every agent
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].flock(this.boids);
    }

    // Perform physics updates for every agent
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].update();
      this.boids[i].borders();
      let found_mine = field.checkCollision(this.boids[i].position)
      if(found_mine){
        // notify all nearby boids of mine detection
        for (let j = 0; j < this.boids.length; j++) {
          let d2 = this.boids[i].params.comms*this.boids[i].params.comms
          if(distSq(this.boids[i].position, this.boids[j].position) < d2)
            this.boids[j].detect(this.boids[i].position)
        }
      }
    }

    // Render every agent
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].render(this.boids, 1, opacity);
    }
  }

  // Adds a boid to the flock and assigns an ID
  addBoid(b){
    this.boids.push(b);
    b.id = this.boidID++;
  }
}
