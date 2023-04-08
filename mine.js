class Mine{
    constructor(x,y){
        this.pos = createVector(x,y)
        this.found = false
    }
    display(size){
        if(this.found) fill("#0f0")
        else fill("#f00")
        ellipse(this.pos.x, this.pos.y, size, size)
    }
}

class MineField{
    PATCH_SIZE = 120
    PER_PATCH = 60
    MINE_SIZE = 6
    MARGIN = 200

    PATCH_SQ = this.PATCH_SIZE*this.PATCH_SIZE * 2.25
    SIZE_SQ = this.MINE_SIZE*this.MINE_SIZE
    constructor(width, height, num_patches){
        this.mines = []
        this.patches = []
        this.found = 0
        if(!num_patches) num_patches = 6
        for(let i=0; i<=num_patches; i++){
            let x = (width - this.PATCH_SIZE*2 - this.MARGIN*2)/num_patches * i
            let y = (height - this.PATCH_SIZE*2 - this.MARGIN*2) * Math.random()
            this.generatePatch(x + this.PATCH_SIZE + this.MARGIN, y + this.PATCH_SIZE + this.MARGIN)
        }
    }

    // Generate a patch of mines
    generatePatch(patch_x,patch_y){
        this.patches.push(createVector(patch_x, patch_y))
        for(let i=0; i<this.PER_PATCH; i++){
            let x = patch_x + (Math.random() - Math.random()) * this.PATCH_SIZE;
            let y = patch_y + (Math.random() - Math.random()) * this.PATCH_SIZE;
            this.mines.push(new Mine(x,y))
        }
    }

    // Render the mines on the field
    display(){
        noStroke()
        for(let mine of this.mines){
            mine.display(this.MINE_SIZE)
        }
    }

    // Collision detection to find mines
    checkCollision(coord){
        let found = false
        for(let i=0; i<this.patches.length; i++){
            if(distSq(coord, this.patches[i]) <= this.PATCH_SQ){
                // In range for this patch, check every mine
                for(let m=i*this.PER_PATCH; m<(i+1)*this.PER_PATCH; m++){
                    if(distSq(coord, this.mines[m].pos) < this.SIZE_SQ){
                        if(!this.mines[m].found){
                            found = true
                            this.found ++
                            this.mines[m].found = true
                        }
                    }
                }
            }
        }
        return found
    }
}

// Utility function for distance squared (save on square root operations)
function distSq(a, b){
    let dx = (a.x - b.x)
    let dy = (a.y - b.y)
    return dx*dx + dy*dy
}