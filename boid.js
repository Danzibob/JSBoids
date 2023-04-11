// Default flocking parameters
const EXPLORING = {
    sep: 50,       // Separation Radius
    neigh: 100,     // Neighbor (attraction) radius
    align: 70,     // Alignment radius
    comms: 80,     // Communication radius
    maxspeed: 1.5,  // Maximum speed
    color: "#000"   // Colour highlight
}
// Combing a patch of mines
const COMBING = {
    sep: 30,
    neigh: 150,
    align: 100,
    comms: 300,
    maxspeed: 2.0,
    color: "#fff"   // Colour highlight
}

class Boid{
    constructor(x,y) {
        // Initialize position, acceleration and velocity vectors
        this.acceleration = createVector(0, 0);
        this.velocity = p5.Vector.random2D();
        this.position = createVector(x, y);

        this.r = 4.0;               // Boid's size
        // this.maxspeed = 2.0;        // Maximum speed
        this.maxforce = 0.03;       // Maximum steering force
        this.hue = Math.random();   // Random colour
        
        this.params = EXPLORING;    // All boids start as exploring

        this.K = {}                 // Knowledge store
        this.since_detect = 0
        
        this.lastForces = {}        // Cache for own forces (for rendering only)
    }

    // "Recieve a message" from another boid
    // Takes referece to another boid and infers message content
    receive(other){
        // Discard message if outside communication zone
        if (p5.Vector.sub(this.position, other.position).magSq() > other.params.comms*other.params.comms) return
        
        // Save agent's velocity, position & colour
        this.K[other.id] = {
            velocity: other.velocity.copy(),
            position: other.position.copy(),
            hue: other.hue,
            staleness: 0,
            hops: 0
        }

        // Save their knowledge
        for(let k in other.K){
            // Only if we don't already have it, or if ours is staler
            if(!(k == this.id) && (other.K[k].hops == 0) && (!(k in this.K) || ( this.K[k].staleness > other.K[k].staleness))){
                this.K[k] = {
                    velocity: other.K[k].velocity.copy(),
                    position: other.K[k].position.copy(),
                    hue: other.K[k].hue,
                    staleness: other.K[k].staleness,
                    hops: other.K[k].hops + 1 
                }
            }
        }

        // Update their position once (accounts for "transmission delay")
        this.K[other.id].position.add(this.K[other.id].velocity)
    }

    // Utility function to apply force to the boid
    applyForce(force){
        // We could add mass here if we want A = F / M
        this.acceleration.add(force);
    }

    // Manage the agent's knowledge store
    updateKnowledgeNaive(boids){
        for(const k in this.K){
            // Decay all keys and remove expired ones
            if(this.K[k].staleness++ > STALE){
                delete this.K[k]
            } else {
                // Update agent's predicted position
                this.K[k].position.add(this.K[k].velocity)
            }
        }

        if(this.since_detect){
            this.since_detect++
            if(this.since_detect > DETECTION_TIMEOUT){
                this.since_detect = 0
                this.params = EXPLORING
            }
        }
    }

    updateKnowledgeIntelligent(){
        // TODO
    }

    // Triggered upon detecting a mine
    detect(pos){
        this.params = COMBING;
        this.since_detect = 1;
        this.detect_pos = pos;
    }

    // Perform all flocking calculations 
    flock(){
        this.updateKnowledgeNaive()

        let sep = this.separate(this.K);   // Separation
        let ali = this.align(this.K);      // Alignment
        let coh = this.cohesion(this.K);   // Cohesion
        let wal = this.walls();           // Walls

        // Weight these forces
        sep.mult(1.0);
        ali.mult(1.0);
        coh.mult(1.0);
        wal.mult(3.0);

        // Add the force vectors to acceleration
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        this.applyForce(wal);

        let goto = createVector(0,0)
        if(this.since_detect){
            goto = this.seek(this.detect_pos);
            goto.mult(1.5);
            // this.applyForce(goto)
        }

        // Cache forces to display later
        if(this.id == 0) this.lastForces = {sep, ali, coh, wal, goto}
    }

    // Use stored acceleration from this.flock to update position
    update(){
        // Update velocity
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.params.maxspeed);
        this.position.add(this.velocity);

        // Reset acceleration to 0 each cycle
        this.acceleration.mult(0);
    }


    // Utility function to steer towards a given coordinate
    seek(target){
        let desired = p5.Vector.sub(target,this.position);
        return this.steer(desired);
    }

    // Utility function for Reynold's steering behaviour
    // Takes a direction vector and a magnitude to set
    // If desired steering is 0,0 no force is required
    steer(desired, mag){
        // If desired is 0, no force needs to be applied
        if (desired.mag() == 0 ) return createVector(0,0)

        // Normalize desired and scale to maximum speed
        desired.normalize();
        desired.mult(this.params.maxspeed);

        // Steering = Desired minus Velocity
        let s = p5.Vector.sub(desired,this.velocity)

        // Set magnitude of force vector
        if (mag) s.setMag(mag)           // Set to custom magnitude
        else     s.limit(this.maxforce)  // Limit to maximum steering force
        return s
    }

    // ALL of the rendering
    render(boids, scl, opacity){
        
        push();
        translate(this.position.x, this.position.y);

        if(this.render_forces && this.lastForces.sep){
            // Draw lines for each force
            push()
            scale(500,500)
            strokeWeight(1/500);
            stroke("#f00")
            line(0,0,this.lastForces.sep.x,this.lastForces.sep.y)
            stroke("#0f0")
            line(0,0,this.lastForces.ali.x,this.lastForces.ali.y)
            stroke("#00f")
            line(0,0,this.lastForces.coh.x,this.lastForces.coh.y)
            stroke("#000")
            line(0,0,this.lastForces.wal.x,this.lastForces.wal.y)
            stroke("#fff")
            line(0,0,this.lastForces.goto.x,this.lastForces.goto.y)
            pop()

            // Draw circles showing force area
            noFill()
            stroke("#f00")
            ellipse(0, 0, this.params.sep*2, this.params.sep*2)
            stroke("#0f0")
            ellipse(0, 0, this.params.neigh*2, this.params.neigh*2)
            stroke("#00f")
            ellipse(0, 0, this.params.align*2, this.params.align*2)
            stroke("#fff4")
            ellipse(0, 0, this.params.comms*2, this.params.comms*2)
        }

        if(scl) scale(scl)
        // Draw a triangle rotated in the direction of velocity
        let theta = this.velocity.heading() + radians(90);
        rotate(theta);
        fill(this.hue, 1,255, opacity);
        strokeWeight(1);
        stroke(this.params.color)
        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);
        pop();

        // Draw percieved world
        if(this.render_forces){
            for(const i in this.K){
                let b = this.K[i]
                push()
                translate(b.position.x, b.position.y)
                if(scl) scale(scl)
                let theta = b.velocity.heading() + radians(90);
                rotate(theta);
                noStroke()
                fill(b.hue, 0.6, 255, 1- (b.staleness / STALE)*0.6);
                beginShape();
                let r = boids[i].r;
                vertex(0, -r * 2);
                vertex(-r, r * 2);
                vertex(r, r * 2);
                endShape(CLOSE);
                pop()
                if (dist(b.position.x, b.position.y, boids[i].position.x, boids[i].position.y) < 100){
                    stroke(b.hue, 0.6, 255)
                    strokeWeight(0.3)
                    line(b.position.x, b.position.y, boids[i].position.x, boids[i].position.y)
                }
            }
        }
    }

    // Manage the behavior of the edges of the world
    borders(){
        // Torus world
        // if (this.position.x < -this.r)  this.position.x = width/SCALE + this.r;
        // if (this.position.y < -this.r)  this.position.y = height/SCALE + this.r;
        // if (this.position.x > width/SCALE + this.r) this.position.x = -this.r;
        // if (this.position.y > height/SCALE + this.r) this.position.y = -this.r;
        // Square world
        if (this.position.x < 0)  this.position.x = 0;
        if (this.position.y < 0)  this.position.y = 0;
        if (this.position.x > width/SCALE) this.position.x = width/SCALE;
        if (this.position.y > height/SCALE) this.position.y = height/SCALE;
    }

    // Utility function for repulsive force from walls (linear)
    wall_force(val, limit){
        let d0 = val;
        let dw = limit - val;
        if (d0 < this.params.comms)      return  Math.abs(this.params.comms - d0)/this.params.comms * this.maxforce;
        else if (dw < this.params.comms) return -Math.abs(this.params.comms - dw)/this.params.comms * this.maxforce;
        else return 0
    }
    
    // Calculate wall avoidance force
    walls(){
        let x_force = this.wall_force(this.position.x, width/SCALE)
        let y_force = this.wall_force(this.position.y, height/SCALE)
        
        let steer = createVector(x_force, y_force)

        // As long as the vector is greater than 0
        return this.steer(steer, steer.mag())
    }

    // Calculate separation force
    separate(boids){
        let steer = createVector(0, 0);
        let count = 0;
        // For every boid in the system, check if it's too close
        for (const i in boids) {
            let d = p5.Vector.dist(this.position,boids[i].position);
            // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
            if ((d > 0) && (d < this.params.sep)) {
            // Calculate vector pointing away from neighbor
            let diff = p5.Vector.sub(this.position, boids[i].position);
            diff.normalize();
            diff.div(d);        // Weight by distance
            steer.add(diff);
            count++;            // Keep track of how many
            }
        }
        // Average -- divide by how many
        if (count > 0) {
            steer.div(Math.log(count)+1);
        }

        // As long as the vector is greater than 0
        return this.steer(steer, steer.mag());
    }

    // Calculate alignment force
    align(boids){
        let neighbordist = this.params.align;
        let sum = createVector(0,0);
        let count = 0;
        for (const i in boids) {
          let d = p5.Vector.dist(this.position,boids[i].position);
          if ((d > 0) && (d < neighbordist)) {
            sum.add(boids[i].velocity);
            count++;
          }
        }
        if (count > 0) {
          sum.div(count);
          sum.normalize();
          sum.mult(this.params.maxspeed);
          let steer = p5.Vector.sub(sum, this.velocity);
          steer.limit(this.maxforce);
          return steer;
        } else {
          return createVector(0, 0);
        }
    }

    // Calculate cohesion force
    cohesion(boids){
        let neighbordist = this.params.neigh;
        let sum = createVector(0, 0);   // Start with empty vector to accumulate all locations
        let count = 0;
        for (const i in boids) {
          let d = p5.Vector.dist(this.position,boids[i].position);
          if ((d > 0) && (d < neighbordist)) {
            sum.add(boids[i].position); // Add location
            count++;
          }
        }
        if (count > 0) {
          sum.div(count);
          return this.seek(sum);  // Steer towards the location
        } else {
          return createVector(0, 0);
        }
    }
}

// Boid code adapted from:
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com
