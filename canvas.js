import { Body } from './body.js';
import { Vector } from './vector.js';

export class Canvas {
  HEIGHT = 600;
  WIDTH = 800;

  isRunning = true;
  showVectors = false;

  bodies = [];
  stars = [];

  constructor (nativeElement) {
    this.nativeElement = nativeElement;

    this.nativeElement.setAttribute('height', this.HEIGHT);
    this.nativeElement.setAttribute('width', this.WIDTH);

    this.setup();
    this.start();
  }

  get ctx () {
    return this.nativeElement.getContext('2d');
  }

  setup () {
    this.sun = new Body('yellow', 15, new Vector(this.WIDTH / 2, this.HEIGHT / 2), null, null, 100);

    this.mercurius = new Body('orange', 3, new Vector(350, 300), new Vector(0, -5), null, 2);

    this.venus = new Body('green', 7, new Vector(400, 200), new Vector(9, 0), null, 10);

    this.earth = new Body('blue', 9, new Vector(400, 500), new Vector(-8, 0), null, 18);
    this.moon = new Body('pink', 2, new Vector(400, 520), new Vector(-8, 0), null, 1.3);

    this.mars = new Body('red', 12, new Vector(700, 300), new Vector(0, 6.7), null, 20);
    this.deimos = new Body('purple', 3, new Vector(740, 300), new Vector(0, 6.7), null, 5.1);
    this.phobos = new Body('cyan', 3, new Vector(730, 300), new Vector(0, 6.7), null, 4);

    this.bodies.push(this.sun, this.mercurius, this.venus, this.earth, this.moon, this.mars, this.deimos, this.phobos);
  }

  async start () {
    while (this.isRunning) {
      this.update();
      await this.sleep(33);
    }
  }

  update () {
    // If the cursor is near the sun (within 100px), move the sun towards the mouse
    if (this.pointer && Vector.sub(this.pointer.pos, this.sun.pos).magnitude < 100)  this.sun.moveTo(this.pointer.pos, .02);
    else this.sun.vel = new Vector(0, 0);

    this.bodies.forEach(body => {
      body.resetAcc();
      this.sun.attract(body);
    });

    this.earth.attract(this.moon);
    this.mars.attract(this.deimos);
    this.mars.attract(this.phobos);

    this.bodies.forEach(body => {
      body.move();
    });

    this.draw();
  }

  draw () {
    if (this.isRunning) this.ctx.fillStyle = 'rgba(0,0,0,.2)';
    else this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.bodies.forEach(body => {
      body.draw(this.ctx, this.showVectors);
    });

    this.drawRandomStars();
  }

  sleep (timeInMs) {
    return new Promise((resolve) => setTimeout(resolve, timeInMs) );
  }

  onMouseMove (event) {
    this.pointer = new Body('white', 3, new Vector(event.offsetX, event.offsetY));
  }

  drawRandomStars () {
    this.stars.push({ x: Math.random() * this.WIDTH, y: Math.random() * this.HEIGHT, r: Math.random() * 3 });

    this.ctx.fillStyle = 'white';
    for (const star of this.stars) {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.r, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    if (this.stars.length > 50) {
      this.stars.splice(0, Math.random() * 10);
    }
  }

  togglePause () {
    this.isRunning = !this.isRunning;
    this.start();
  }

  reset () {
    this.bodies = [];
    this.stars = [];
    this.setup();
    this.update();
  }
}
