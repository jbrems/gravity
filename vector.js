export class Vector {
  constructor (x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add (vector) {
    this.x = this.x + vector.x;
    this.y = this.y + vector.y;
  }

  static sub (vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }

  mult (amount) {
    this.x = this.x * amount;
    this.y = this.y * amount;
  }

  get magnitude () {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  set magnitude (magnitude) {
    this.normalize();
    this.mult(magnitude);
  }

  normalize () {
    const mag = this.magnitude;
    if (mag !== 0) {
      this.x = this.x / mag;
      this.y = this.y / mag;
    }
  }
}
