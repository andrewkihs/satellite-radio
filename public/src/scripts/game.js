import Satellite from "./satellite.js";
import Star from "./star.js";
import { sgp4 } from "satellite.js";
class Game {
  constructor(xDim, yDim, tle, audioCtx) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.satellites = [];
    this.stars = [];
    this.tle = tle;
    this.audioCtx = audioCtx;
    this.addSatellites(tle);
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
  addSatellites(tle) {
    const satrec = satellite.twoline2satrec(
      this.tle.split("\n")[0].trim(),
      this.tle.split("\n")[1].trim()
    );
    // debugger;

    // for (let i = 0; i < 100; i++) {
    //   // debugger;
    //   console.log(satellitesObj[i]);
    let currentSatellite = new Satellite(satrec, this);
    this.satellites.push(currentSatellite);
    // }
  }

  draw(ctx) {
    // ctx.clearRect(0, 0, this.xDim, this.yDim);
    // ctx.fillStyle = "black";
    // ctx.fillRect(0, 0, this.xDim, this.yDim);
    // this.stars.forEach((star) => star.draw(ctx));
    // this.satellites.forEach((satellite) => satellite.draw(ctx));
  }

  move(ctx) {
    // this.satellites.forEach((satellite) => satellite.move(ctx));
  }
}

export default Game;
