
// Chance for an agent to send a message update per simulation tick
const MESSAGE_CHANCE = 0.1;
// Simulation ticks for a knowledge store item to go stale
const STALE = 60; 
const DETECTION_TIMEOUT = 120;

const NUM_BOIDS = 60;

const SIMULATION_SPEED = 2; 

let flock;
let field;
const SCALE = 0.1;
const FPV_SCALE = 0.7;

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
  if(frameCount % 10 == 0 && frameCount/60 < 60){
    const stats = flock.stats()
    PLOT.data.labels.push(frameCount/60)
    // PLOT.data.datasets[0].data.push(stats.polarisation + stats.angular_momentum)
    PLOT.data.datasets[1].data.push(stats.polarisation)
    PLOT.data.datasets[2].data.push(stats.angular_momentum)
    PLOT.data.datasets[3].data.push(stats.error)
    PLOT.data.datasets[5].data.push(stats.speed)
    PLOT.update();
  }
 
}

class Flock {
  boidID = 0; // boid ID counter

  constructor() {
    // An array for all the boids
    this.boids = []; // Initialize the array
    this.tick = 0 
  }

  // Manage flock simulation and rendering
  run(field, opacity){
    this.tick++
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
      // let found_mine = field.checkCollision(this.boids[i].position)
      // if(found_mine){
        // notify all nearby boids of mine detection
        // for (let j = 0; j < this.boids.length; j++) {
        //   let d2 = this.boids[i].params.comms*this.boids[i].params.comms
        //   if(distSq(this.boids[i].position, this.boids[j].position) < d2)
        //     this.boids[j].detect(this.boids[i].position.copy())
        // }
      // }
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

  // ---=== STATS SECTION ===---
  stats(){
    const center = createVector(0, 0)
    const polarisation_sum = createVector(0, 0)
    let error = 0;
    for (let i = 0; i < this.boids.length; i++){
      polarisation_sum.add(p5.Vector.normalize(this.boids[i].velocity))
      center.add(this.boids[i].position)
      let agent_error = 0;
      let knowledge_count = 0;
      for(let k in this.boids[i].K){
        agent_error += p5.Vector.sub(this.boids[i].K[k].position, this.boids[k].position).mag()
        knowledge_count++
      }
      if(knowledge_count > 0){
        error += agent_error / knowledge_count
      }
    }
    error /= this.boids.length
    const polarisation = polarisation_sum.mag()/this.boids.length
    center.div(this.boids.length)
    const momentum_sum = createVector(0, 0)
    for (let i = 0; i < this.boids.length; i++){
      const relative_pos = p5.Vector.sub(this.boids[i].position, center) 
      relative_pos.normalize()
      momentum_sum.add(relative_pos.cross(p5.Vector.normalize(this.boids[i].velocity)))
    }
    const angular_momentum = momentum_sum.mag()/this.boids.length

    let speed = 0
    if(this.last_center){
      const time_delta = (this.tick - this.last_center_tick)/60
      speed = p5.Vector.sub(this.last_center, center).mag()/time_delta
    } else {
    } 
    this.last_center = center
    this.last_center_tick = this.tick
    return {
      polarisation,
      angular_momentum,
      error,
      speed
    }
  }
}
