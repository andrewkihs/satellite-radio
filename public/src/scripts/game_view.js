import Game from "./game";

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    const outer = this;
    setInterval(function () {
      // debugger;
      outer.game.xDim = window.innerWidth;
      outer.game.yDim = window.innerHeight;
      outer.game.move(outer.ctx);
      outer.game.draw(outer.ctx);
    }, 1);
  }
}

export default GameView;
