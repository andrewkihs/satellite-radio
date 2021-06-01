import Satellite from "./satellite.js";

class Game {
  constructor(xDim, yDim) {
    this.xDim = xDim;
    this.yDim = yDim;
    this.satellites = [];
    this.addSatellites();
  }

  randomPos() {
    return [
      Math.floor(Math.random() * this.xDim),
      Math.floor(Math.random() * this.yDim),
    ];
  }

  addSatellites() {
    for (let i = 0; i < 4; i++) {
      let currentSatellite = new Satellite(this.randomPos(), [3, 4], 30, this);
      // debugger;
      this.satellites.push(currentSatellite);
    }
    let markerSatellite = new Satellite([0, 1], 6, 20, this);
    this.satellites.push(markerSatellite);
  }

  draw(ctx) {
    ctx.clearRect(0, 0, this.xDim, this.yDim);
    debugger;
    this.satellites.forEach((satellite) => satellite.draw(ctx));
  }

  move(ctx) {
    this.satellites.forEach((satellite) => satellite.move(ctx));
  }

  start(canvasEl) {
    debugger;
    const ctx = canvasEl.getContext("2d");

    //this function will update the position of all the circles,
    //clear the canvas, and redraw them
    const animateCallback = () => {
      // this.moveCircles();
      // let currentSatellite = new Satellite(this.randomPos(), 5, 5, this);
      currentSatellite.draw(ctx);
      // Satellite.draw(ctx);
      this.render(ctx);
      //this will call our animateCallback again, but only when the browser
      //is ready, usually every 1/60th of a second
      requestAnimationFrame(animateCallback);
    };
    animateCallback();
  }
}

export default Game;
