import Game from "./game";

class GameView {
  constructor(game, ctx) {
    this.game = game;
    this.ctx = ctx;
  }

  start() {
    const outer = this;
    debugger;
    setInterval(function () {
      outer.game.move(outer.ctx);
      outer.game.draw(outer.ctx);
    }, 1000);
  }
}

export default GameView;
