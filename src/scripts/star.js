class Star {
  constructor(pos, game) {
    this.pos = pos;
    this.game = game;
    this.xVal = Math.floor(Math.random() * 1) + 1;
    this.yVal = Math.floor(Math.random() * 1) + 1;
  }

  draw(ctx) {
    ctx.fillStyle = "white";
    ctx.fillRect(this.pos[0], this.pos[1], this.xVal, this.yVal);
  }
}

export default Star;
