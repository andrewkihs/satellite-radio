import Satellite from "./satellite.js";
import Star from "./star.js";
class Game {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.satellites = [];
    this.stars = [];
    this.addSatellites();
    this.addStars();
  }

  randomPos() {
    return [
      Math.floor(Math.random() * this.xDim),
      Math.floor(Math.random() * this.yDim),
    ];
  }
  addStars() {
    for (let i = 0; i < 1700; i++) {
      let currentStar = new Star(this.randomPos(), this);
      this.stars.push(currentStar);
    }
  }
  addSatellites() {
    for (let i = 0; i < 4; i++) {
      let currentSatellite = new Satellite(this.randomPos(), [3, 4], 30, this);
      this.satellites.push(currentSatellite);
    }
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, this.xDim, this.yDim);
    this.stars.forEach((star) => star.draw(ctx));
    this.satellites.forEach((satellite) => satellite.draw(ctx));
  }

  move(ctx) {
    this.satellites.forEach((satellite) => satellite.move(ctx));
  }
}

export default Game;
