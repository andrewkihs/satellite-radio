import map_range from "./math_util";
class SatelliteOsc {
  constructor(satRec, game) {
    this.date = new Date();
    this.positionAndVelocity = satellite.propagate(satRec, this.date);
    this.gmst = satellite.gstime(this.date);

    this.position = satellite.eciToGeodetic(
      this.positionAndVelocity.position,
      this.gmst
    );

    this.game = game;
    this.audioCtx = game.audioCtx;
  }

  startOsc() {
    this.oscillator.type = "sine";
    debugger;
    const newFreq = map_range(this.pos[1], 0, this.game.yDim, 0, 20000);
    console.log(newFreq);
    this.oscillator.frequency.value = newFreq;
    // debugger;
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.001; // 10 %
    gainNode.connect(this.audioCtx.destination);

    this.oscillator.connect(gainNode);
    this.oscillator.start(0);
  }

  draw(ctx) {}

  move() {
    // this.pos[0] += this.vel[0];
    // this.pos[1] += this.vel[1];
    // debugger;
    // if (this.isOutOfBounds(this.pos)) {
    //   this.pos = [
    //     this.wrap(this.pos[0], this.game.xDim),
    //     this.wrap(this.pos[1], this.game.yDim),
    //   ];
    // }
  }
  isOutOfBounds(pos) {
    // debugger;
    return (
      pos[0] < 0 ||
      pos[1] < 0 ||
      pos[0] > this.game.xDim ||
      pos[1] > this.game.yDim
    );
  }

  wrap(coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
}

export default SatelliteOsc;
