import "./styles/index.scss";
import Game from "./scripts/game";
import GameView from "./scripts/game_view";
import receiveData from "./scripts/api_util";

window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  receiveData;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const g = new Game(canvas.width, canvas.height);
  const gameview = new GameView(g, ctx);
  gameview.start();
  // new Game(canvas.width, canvas.height).start(canvas);
});
