import { Vector } from './vector.js';

const GRAV_CONST = 6.67;

export class Body {
  constructor (color, radius, position, velocity, acceleration, mass) {
    this.color = color;
    this.radius = radius;
    this.pos = position;
    this.vel = velocity || new Vector(0, 0);
    this.acc = acceleration || new Vector(0, 0);
    this.mass = mass || 1;
  }

  move () {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
  }

  moveTo(pos, speed) {
    this.vel = new Vector((pos.x - this.pos.x ) * speed, (pos.y - this.pos.y) * speed);
  }

  attract (body) {
    const gravityVector = new Vector(this.pos.x - body.pos.x, this.pos.y - body.pos.y);

    if (gravityVector.magnitude !== 0) {
      const gravity = GRAV_CONST * this.mass * body.mass / Math.pow(gravityVector.magnitude, 2);
      gravityVector.magnitude = Math.min(gravity, 1);

      body.acc.add(gravityVector);
    }
  }

  draw (ctx, showVectors) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos.x, this.pos.y, this.radius, 0, 2*Math.PI);
    ctx.fill();

    if (showVectors) {
      ctx.strokeStyle = 'cyan';
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(this.pos.x + this.acc.x * 25, this.pos.y + this.acc.y * 25);
      ctx.stroke();

      ctx.strokeStyle = 'white';
      ctx.beginPath();
      ctx.moveTo(this.pos.x, this.pos.y);
      ctx.lineTo(this.pos.x + this.vel.x * 25, this.pos.y + this.vel.y * 25);
      ctx.stroke();
    }
  }
}
