class Satellite {
  constructor(pos, vel, radius, game) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.game = game;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
    ctx.strokeStyle = "blue";
    ctx.lineWidth = 10;
    ctx.fillStyle = "#46C016";
    ctx.fill();
  }

  move() {
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];
  }
}

export default Satellite;
