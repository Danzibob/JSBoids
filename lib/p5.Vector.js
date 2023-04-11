const TWO_PI = Math.TWO_PI 

const calculateRemainder2D = function(xComponent, yComponent) {
  if (xComponent !== 0) {
    this.x = this.x % xComponent;
  }
  if (yComponent !== 0) {
    this.y = this.y % yComponent;
  }
  return this;
};

const calculateRemainder3D = function(xComponent, yComponent, zComponent) {
  if (xComponent !== 0) {
    this.x = this.x % xComponent;
  }
  if (yComponent !== 0) {
    this.y = this.y % yComponent;
  }
  if (zComponent !== 0) {
    this.z = this.z % zComponent;
  }
  return this;
};

const p5 = {}

p5.Vector = class {
  // This is how it comes in with createVector()
  // This check if the first argument is a function
  constructor(...args) {
    let x, y, z;
    if (typeof args[0] === 'function') {
      this.isPInst = true;
      this._fromRadians = args[0];
      this._toRadians = args[1];
      x = args[2] || 0;
      y = args[3] || 0;
      z = args[4] || 0;
      // This is what we'll get with new p5.Vector()
    } else {
      x = args[0] || 0;
      y = args[1] || 0;
      z = args[2] || 0;
    }
    this.x = x
    this.y = y
    this.z = z;
  }

  toString() {
    return `p5.Vector Object : [${this.x}, ${this.y}, ${this.z}]`;
  }

  set (x, y, z) {
    if (x instanceof p5.Vector) {
      this.x = x.x || 0;
      this.y = x.y || 0;
      this.z = x.z || 0;
      return this;
    }
    if (Array.isArray(x)) {
      this.x = x[0] || 0;
      this.y = x[1] || 0;
      this.z = x[2] || 0;
      return this;
    }
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
    return this;
  }

  copy () {
    if (this.isPInst) {
      return new p5.Vector(
        this._fromRadians,
        this._toRadians,
        this.x,
        this.y,
        this.z
      );
    } else {
      return new p5.Vector(this.x, this.y, this.z);
    }
  }

  add (x, y, z) {
    if (x instanceof p5.Vector) {
      this.x += x.x || 0;
      this.y += x.y || 0;
      this.z += x.z || 0;
      return this;
    }
    if (Array.isArray(x)) {
      this.x += x[0] || 0;
      this.y += x[1] || 0;
      this.z += x[2] || 0;
      return this;
    }
    this.x += x || 0;
    this.y += y || 0;
    this.z += z || 0;
    return this;
  }

  rem (x, y, z) {
    if (x instanceof p5.Vector) {
      if ([x.x,x.y,x.z].every(Number.isFinite)) {
        const xComponent = parseFloat(x.x);
        const yComponent = parseFloat(x.y);
        const zComponent = parseFloat(x.z);
        return calculateRemainder3D.call(
          this,
          xComponent,
          yComponent,
          zComponent
        );
      }
    } else if (Array.isArray(x)) {
      if (x.every(element => Number.isFinite(element))) {
        if (x.length === 2) {
          return calculateRemainder2D.call(this, x[0], x[1]);
        }
        if (x.length === 3) {
          return calculateRemainder3D.call(this, x[0], x[1], x[2]);
        }
      }
    } else if (arguments.length === 1) {
      if (Number.isFinite(arguments[0]) && arguments[0] !== 0) {
        this.x = this.x % arguments[0];
        this.y = this.y % arguments[0];
        this.z = this.z % arguments[0];
        return this;
      }
    } else if (arguments.length === 2) {
      const vectorComponents = [...arguments];
      if (vectorComponents.every(element => Number.isFinite(element))) {
        if (vectorComponents.length === 2) {
          return calculateRemainder2D.call(
            this,
            vectorComponents[0],
            vectorComponents[1]
          );
        }
      }
    } else if (arguments.length === 3) {
      const vectorComponents = [...arguments];
      if (vectorComponents.every(element => Number.isFinite(element))) {
        if (vectorComponents.length === 3) {
          return calculateRemainder3D.call(
            this,
            vectorComponents[0],
            vectorComponents[1],
            vectorComponents[2]
          );
        }
      }
    }
  }

  sub(x, y, z) {
    if (x instanceof p5.Vector) {
      this.x -= x.x || 0;
      this.y -= x.y || 0;
      this.z -= x.z || 0;
      return this;
    }
    if (Array.isArray(x)) {
      this.x -= x[0] || 0;
      this.y -= x[1] || 0;
      this.z -= x[2] || 0;
      return this;
    }
    this.x -= x || 0;
    this.y -= y || 0;
    this.z -= z || 0;
    return this;
  }

  mult(x, y, z) {
    if (x instanceof p5.Vector) {
    // new p5.Vector will check that values are valid upon construction but it's possible
    // that someone could change the value of a component after creation, which is why we still
    // perform this check
      if (
        Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
      ) {
        this.x *= x.x;
        this.y *= x.y;
        this.z *= x.z;
      } else {
        console.warn(
          'p5.Vector.prototype.mult:',
          'x contains components that are either undefined or not finite numbers'
        );
      }
      return this;
    }
    if (Array.isArray(x)) {
      if (
        x.every(element => Number.isFinite(element)) &&
      x.every(element => typeof element === 'number')
      ) {
        if (x.length === 1) {
          this.x *= x[0];
          this.y *= x[0];
          this.z *= x[0];
        } else if (x.length === 2) {
          this.x *= x[0];
          this.y *= x[1];
        } else if (x.length === 3) {
          this.x *= x[0];
          this.y *= x[1];
          this.z *= x[2];
        }
      } else {
        console.warn(
          'p5.Vector.prototype.mult:',
          'x contains elements that are either undefined or not finite numbers'
        );
      }
      return this;
    }

    const vectorComponents = [...arguments];
    if (
      vectorComponents.every(element => Number.isFinite(element)) &&
    vectorComponents.every(element => typeof element === 'number')
    ) {
      if (arguments.length === 1) {
        this.x *= x;
        this.y *= x;
        this.z *= x;
      }
      if (arguments.length === 2) {
        this.x *= x;
        this.y *= y;
      }
      if (arguments.length === 3) {
        this.x *= x;
        this.y *= y;
        this.z *= z;
      }
    } else {
      console.warn(
        'p5.Vector.prototype.mult:',
        'x, y, or z arguments are either undefined or not a finite number'
      );
    }

    return this;
  }

  div(x, y, z) {
    if (x instanceof p5.Vector) {
    // new p5.Vector will check that values are valid upon construction but it's possible
    // that someone could change the value of a component after creation, which is why we still
    // perform this check
      if (
        Number.isFinite(x.x) &&
      Number.isFinite(x.y) &&
      Number.isFinite(x.z) &&
      typeof x.x === 'number' &&
      typeof x.y === 'number' &&
      typeof x.z === 'number'
      ) {
        const isLikely2D = x.z === 0 && this.z === 0;
        if (x.x === 0 || x.y === 0 || (!isLikely2D && x.z === 0)) {
          console.warn('p5.Vector.prototype.div:', 'divide by 0');
          return this;
        }
        this.x /= x.x;
        this.y /= x.y;
        if (!isLikely2D) {
          this.z /= x.z;
        }
      } else {
        console.warn(
          'p5.Vector.prototype.div:',
          'x contains components that are either undefined or not finite numbers'
        );
      }
      return this;
    }
    if (Array.isArray(x)) {
      if (
        x.every(element => Number.isFinite(element)) &&
      x.every(element => typeof element === 'number')
      ) {
        if (x.some(element => element === 0)) {
          console.warn('p5.Vector.prototype.div:', 'divide by 0');
          return this;
        }

        if (x.length === 1) {
          this.x /= x[0];
          this.y /= x[0];
          this.z /= x[0];
        } else if (x.length === 2) {
          this.x /= x[0];
          this.y /= x[1];
        } else if (x.length === 3) {
          this.x /= x[0];
          this.y /= x[1];
          this.z /= x[2];
        }
      } else {
        console.warn(
          'p5.Vector.prototype.div:',
          'x contains components that are either undefined or not finite numbers'
        );
      }

      return this;
    }

    const vectorComponents = [...arguments];
    if (
      vectorComponents.every(element => Number.isFinite(element)) &&
    vectorComponents.every(element => typeof element === 'number')
    ) {
      if (vectorComponents.some(element => element === 0)) {
        console.warn('p5.Vector.prototype.div:', 'divide by 0');
        return this;
      }

      if (arguments.length === 1) {
        this.x /= x;
        this.y /= x;
        this.z /= x;
      }
      if (arguments.length === 2) {
        this.x /= x;
        this.y /= y;
      }
      if (arguments.length === 3) {
        this.x /= x;
        this.y /= y;
        this.z /= z;
      }
    } else {
      console.warn(
        'p5.Vector.prototype.div:',
        'x, y, or z arguments are either undefined or not a finite number'
      );
    }

    return this;
  }

  mag() {
    return Math.sqrt(this.magSq());
  }

  magSq() {
    const x = this.x;
    const y = this.y;
    const z = this.z;
    return x * x + y * y + z * z;
  }

  dot(x, y, z) {
    if (x instanceof p5.Vector) {
      return this.dot(x.x, x.y, x.z);
    }
    return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
  }

  cross(v) {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    if (this.isPInst) {
      return new p5.Vector(this._fromRadians, this._toRadians, x, y, z);
    } else {
      return new p5.Vector(x, y, z);
    }
  }

  dist(v) {
    return v
      .copy()
      .sub(this)
      .mag();
  }

  normalize() {
    const len = this.mag();
    // here we multiply by the reciprocal instead of calling 'div()'
    // since div duplicates this zero check.
    if (len !== 0) this.mult(1 / len);
    return this;
  }

  limit(max) {
    const mSq = this.magSq();
    if (mSq > max * max) {
      this.div(Math.sqrt(mSq)) //normalize it
        .mult(max);
    }
    return this;
  }

  setMag(n) {
    return this.normalize().mult(n);
  }

  heading() {
    const h = Math.atan2(this.y, this.x);
    if (this.isPInst) return this._fromRadians(h);
    return h;
  }

  setHeading(a) {
    if (this.isPInst) a = this._toRadians(a);
    let m = this.mag();
    this.x = m * Math.cos(a);
    this.y = m * Math.sin(a);
    return this;
  }

  rotate(a) {
    let newHeading = this.heading() + a;
    if (this.isPInst) newHeading = this._toRadians(newHeading);
    const mag = this.mag();
    this.x = Math.cos(newHeading) * mag;
    this.y = Math.sin(newHeading) * mag;
    return this;
  }

  angleBetween(v) {
    const dotmagmag = this.dot(v) / (this.mag() * v.mag());
    // Mathematically speaking: the dotmagmag variable will be between -1 and 1
    // inclusive. Practically though it could be slightly outside this range due
    // to floating-point rounding issues. This can make Math.acos return NaN.
    //
    // Solution: we'll clamp the value to the -1,1 range
    let angle;
    angle = Math.acos(Math.min(1, Math.max(-1, dotmagmag)));
    angle = angle * Math.sign(this.cross(v).z || 1);
    if (this.isPInst) {
      angle = this._fromRadians(angle);
    }
    return angle;
  }

  lerp(x, y, z, amt) {
    if (x instanceof p5.Vector) {
      return this.lerp(x.x, x.y, x.z, y);
    }
    this.x += (x - this.x) * amt || 0;
    this.y += (y - this.y) * amt || 0;
    this.z += (z - this.z) * amt || 0;
    return this;
  }

  reflect(surfaceNormal) {
    surfaceNormal.normalize();
    return this.sub(surfaceNormal.mult(2 * this.dot(surfaceNormal)));
  }

  array() {
    return [this.x || 0, this.y || 0, this.z || 0];
  }

  equals(x, y, z) {
    let a, b, c;
    if (x instanceof p5.Vector) {
      a = x.x || 0;
      b = x.y || 0;
      c = x.z || 0;
    } else if (Array.isArray(x)) {
      a = x[0] || 0;
      b = x[1] || 0;
      c = x[2] || 0;
    } else {
      a = x || 0;
      b = y || 0;
      c = z || 0;
    }
    return this.x === a && this.y === b && this.z === c;
  }

  static fromAngle(angle, length) {
    if (typeof length === 'undefined') {
      length = 1;
    }
    return new p5.Vector(length * Math.cos(angle), length * Math.sin(angle), 0);
  }

  static fromAngles(theta, phi, length) {
    if (typeof length === 'undefined') {
      length = 1;
    }
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);

    return new p5.Vector(
      length * sinTheta * sinPhi,
      -length * cosTheta,
      length * sinTheta * cosPhi
    );
  }

  static random2D() {
    return this.fromAngle(Math.random() * TWO_PI);
  }

  static random3D() {
    const angle = Math.random() * TWO_PI;
    const vz = Math.random() * 2 - 1;
    const vzBase = Math.sqrt(1 - vz * vz);
    const vx = vzBase * Math.cos(angle);
    const vy = vzBase * Math.sin(angle);
    return new p5.Vector(vx, vy, vz);
  }

  static copy(v) {
    return v.copy(v);
  }

  static add(v1, v2, target) {
    if (!target) {
      target = v1.copy();
      if (arguments.length === 3) {
        p5._friendlyError(
          'The target parameter is undefined, it should be of type p5.Vector',
          'p5.Vector.add'
        );
      }
    } else {
      target.set(v1);
    }
    target.add(v2);
    return target;
  }

  static rem(v1, v2) {
    if (v1 instanceof p5.Vector && v2 instanceof p5.Vector) {
      let target = v1.copy();
      target.rem(v2);
      return target;
    }
  }

  static sub(v1, v2, target) {
    if (!target) {
      target = v1.copy();
      if (arguments.length === 3) {
        p5._friendlyError(
          'The target parameter is undefined, it should be of type p5.Vector',
          'p5.Vector.sub'
        );
      }
    } else {
      target.set(v1);
    }
    target.sub(v2);
    return target;
  }

  static mult(v, n, target) {
    if (!target) {
      target = v.copy();
      if (arguments.length === 3) {
        p5._friendlyError(
          'The target parameter is undefined, it should be of type p5.Vector',
          'p5.Vector.mult'
        );
      }
    } else {
      target.set(v);
    }
    target.mult(n);
    return target;
  }

  /**
 * Rotates the vector (only 2D vectors) by the given angle; magnitude remains the same. Returns a new vector.
 */

  /**
 * @method rotate
 * @static
 * @param  {p5.Vector} v
 * @param  {Number} angle
 * @param  {p5.Vector} [target] The vector to receive the result
 */
  static rotate(v, a, target) {
    if (arguments.length === 2) {
      target = v.copy();
    } else {
      if (!(target instanceof p5.Vector)) {
        p5._friendlyError(
          'The target parameter should be of type p5.Vector',
          'p5.Vector.rotate'
        );
      }
      target.set(v);
    }
    target.rotate(a);
    return target;
  }

  /**
 * Divides a vector by a scalar and returns a new vector.
 */

  /**
 * @method div
 * @static
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} [z]
 * @return {p5.Vector} The resulting new <a href="#/p5.Vector">p5.Vector</a>
 */

  /**
 * @method div
 * @static
 * @param  {p5.Vector} v
 * @param  {Number}  n
 * @param  {p5.Vector} [target] The vector to receive the result
 */

  /**
 * @method div
 * @static
 * @param  {p5.Vector} v0
 * @param  {p5.Vector} v1
 * @param  {p5.Vector} [target]
 */

  /**
 * @method div
 * @static
 * @param  {p5.Vector} v0
 * @param  {Number[]} arr
 * @param  {p5.Vector} [target]
 */
  static div(v, n, target) {
    if (!target) {
      target = v.copy();

      if (arguments.length === 3) {
        p5._friendlyError(
          'The target parameter is undefined, it should be of type p5.Vector',
          'p5.Vector.div'
        );
      }
    } else {
      target.set(v);
    }
    target.div(n);
    return target;
  }

  /**
 * Calculates the dot product of two vectors.
 */
  /**
 * @method dot
 * @static
 * @param  {p5.Vector} v1 The first <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 The second <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}     The dot product
 */
  static dot(v1, v2) {
    return v1.dot(v2);
  }

  /**
 * Calculates the cross product of two vectors.
 */
  /**
 * @method cross
 * @static
 * @param  {p5.Vector} v1 The first <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 The second <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}     The cross product
 */
  static cross(v1, v2) {
    return v1.cross(v2);
  }

  /**
 * Calculates the Euclidean distance between two points (considering a
 * point as a vector object).
 */
  /**
 * @method dist
 * @static
 * @param  {p5.Vector} v1 The first <a href="#/p5.Vector">p5.Vector</a>
 * @param  {p5.Vector} v2 The second <a href="#/p5.Vector">p5.Vector</a>
 * @return {Number}     The distance
 */
  static dist(v1, v2) {
    return v1.dist(v2);
  }

  /**
 * Linear interpolate a vector to another vector and return the result as a
 * new vector.
 */
  /**
 * @method lerp
 * @static
 * @param {p5.Vector} v1
 * @param {p5.Vector} v2
 * @param {Number} amt
 * @param {p5.Vector} [target] The vector to receive the result
 * @return {p5.Vector}      The lerped value
 */
  static lerp(v1, v2, amt, target) {
    if (!target) {
      target = v1.copy();
      if (arguments.length === 4) {
        p5._friendlyError(
          'The target parameter is undefined, it should be of type p5.Vector',
          'p5.Vector.lerp'
        );
      }
    } else {
      target.set(v1);
    }
    target.lerp(v2, amt);
    return target;
  }

  /**
 * Calculates the magnitude (length) of the vector and returns the result as
 * a float (this is simply the equation `sqrt(x*x + y*y + z*z)`.)
 */
  /**
 * @method mag
 * @static
 * @param {p5.Vector} vecT The vector to return the magnitude of
 * @return {Number}        The magnitude of vecT
 */
  static mag(vecT) {
    return vecT.mag();
  }

  /**
 * Calculates the squared magnitude of the vector and returns the result
 * as a float (this is simply the equation <em>(x\*x + y\*y + z\*z)</em>.)
 * Faster if the real length is not required in the
 * case of comparing vectors, etc.
 */
  /**
 * @method magSq
 * @static
 * @param {p5.Vector} vecT the vector to return the squared magnitude of
 * @return {Number}        the squared magnitude of vecT
 */
  static magSq(vecT) {
    return vecT.magSq();
  }

  /**
 * Normalize the vector to length 1 (make it a unit vector).
 */
  /**
 * @method normalize
 * @static
 * @param {p5.Vector} v  The vector to normalize
 * @param {p5.Vector} [target] The vector to receive the result
 * @return {p5.Vector}   The vector v, normalized to a length of 1
 */
  static normalize(v, target) {
    if (arguments.length < 2) {
      target = v.copy();
    } else {
      if (!(target instanceof p5.Vector)) {
        p5._friendlyError(
          'The target parameter should be of type p5.Vector',
          'p5.Vector.normalize'
        );
      }
      target.set(v);
    }
    return target.normalize();
  }

  /**
 * Limit the magnitude of the vector to the value used for the <b>max</b>
 * parameter.
 */
  /**
 * @method limit
 * @static
 * @param {p5.Vector} v  the vector to limit
 * @param {Number}    max
 * @param {p5.Vector} [target] the vector to receive the result (Optional)
 * @return {p5.Vector} v with a magnitude limited to max
 */
  static limit(v, max, target) {
    if (arguments.length < 3) {
      target = v.copy();
    } else {
      if (!(target instanceof p5.Vector)) {
        p5._friendlyError(
          'The target parameter should be of type p5.Vector',
          'p5.Vector.limit'
        );
      }
      target.set(v);
    }
    return target.limit(max);
  }

  /**
 * Set the magnitude of the vector to the value used for the <b>len</b>
 * parameter.
 */
  /**
 * @method setMag
 * @static
 * @param {p5.Vector} v  the vector to set the magnitude of
 * @param {number}    len
 * @param {p5.Vector} [target] the vector to receive the result (Optional)
 * @return {p5.Vector} v with a magnitude set to len
 */
  static setMag(v, len, target) {
    if (arguments.length < 3) {
      target = v.copy();
    } else {
      if (!(target instanceof p5.Vector)) {
        p5._friendlyError(
          'The target parameter should be of type p5.Vector',
          'p5.Vector.setMag'
        );
      }
      target.set(v);
    }
    return target.setMag(len);
  }

  /**
 * Calculate the angle of rotation for this vector (only 2D vectors).
 * p5.Vectors created using <a href="#/p5/createVector">createVector()</a>
 * will take the current <a href="#/p5/angleMode">angleMode</a> into
 * consideration, and give the angle in radians or degrees accordingly.
 */
  /**
 * @method heading
 * @static
 * @param {p5.Vector} v the vector to find the angle of
 * @return {Number} the angle of rotation
 */
  static heading(v) {
    return v.heading();
  }

  /**
 * Calculates and returns the angle between two vectors. This function will take
 * the <a href="#/p5/angleMode">angleMode</a> on v1 into consideration, and
 * give the angle in radians or degrees accordingly.
 */
  /**
 * @method angleBetween
 * @static
 * @param  {p5.Vector}    v1 the first vector
 * @param  {p5.Vector}    v2 the second vector
 * @return {Number}       the angle between the two vectors
 */
  static angleBetween(v1, v2) {
    return v1.angleBetween(v2);
  }

  /**
 * Reflect a vector about a normal to a line in 2D, or about a normal to a
 * plane in 3D.
 */
  /**
 * @method reflect
 * @static
 * @param  {p5.Vector} incidentVector vector to be reflected
 * @param  {p5.Vector} surfaceNormal
 * @param  {p5.Vector} [target] the vector to receive the result (Optional)
 * @return {p5.Vector} the reflected vector
 */
  static reflect(incidentVector, surfaceNormal, target) {
    if (arguments.length < 3) {
      target = incidentVector.copy();
    } else {
      if (!(target instanceof p5.Vector)) {
        p5._friendlyError(
          'The target parameter should be of type p5.Vector',
          'p5.Vector.reflect'
        );
      }
      target.set(incidentVector);
    }
    return target.reflect(surfaceNormal);
  }

  /**
 * Return a representation of this vector as a float array. This is only
 * for temporary use. If used in any other fashion, the contents should be
 * copied by using the <b>p5.Vector.<a href="#/p5.Vector/copy">copy()</a></b>
 * method to copy into your own vector.
 */
  /**
 * @method array
 * @static
 * @param  {p5.Vector} v the vector to convert to an array
 * @return {Number[]} an Array with the 3 values
 */
  static array(v) {
    return v.array();
  }

  /**
 * Equality check against a <a href="#/p5.Vector">p5.Vector</a>
 */
  /**
 * @method equals
 * @static
 * @param {p5.Vector|Array} v1 the first vector to compare
 * @param {p5.Vector|Array} v2 the second vector to compare
 * @return {Boolean}
 */
  static equals(v1, v2) {
    let v;
    if (v1 instanceof p5.Vector) {
      v = v1;
    } else if (v1 instanceof Array) {
      v = new p5.Vector().set(v1);
    } else {
      p5._friendlyError(
        'The v1 parameter should be of type Array or p5.Vector',
        'p5.Vector.equals'
      );
    }
    return v.equals(v2);
  }
};
// export default p5.Vector;

const createVector = function (x,y,z) {
    return new p5.Vector(x,y,z)
} 