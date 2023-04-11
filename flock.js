class Flock {
    boidID = 0; // boid ID counter
  
    constructor() {
      // An array for all the boids
      this.boids = []; // Initialize the array
      this.tick = 0 
    }
  
    // Manage flock simulation and rendering
    run(field, opacity, render){
      if(render === undefined) render = true
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
      if(render){
        for (let i = 0; i < this.boids.length; i++) {
            this.boids[i].render(this.boids, 1, opacity);
        }
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
  