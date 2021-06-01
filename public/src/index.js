import "./styles/index.scss";
import Game from "./scripts/game";
import GameView from "./scripts/game_view";
import receiveData from "./scripts/api_util";
import handlePlay from "./scripts/button_util";
window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const audioCtx = new AudioContext();
  handlePlay(audioCtx);

  receiveData.then((response) => {
    // debugger;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const g = new Game(canvas.width, canvas.height, response.data, audioCtx);
    const gameview = new GameView(g, ctx);
    gameview.start();
  });

  // new Game(canvas.width, canvas.height).start(canvas);
});
