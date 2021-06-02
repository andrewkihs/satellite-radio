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

  // receiveData.then((response) => {
  // debugger;
  const ISS_TLE = `1 25544U 98067A   21122.75616700  .00027980  00000-0  51432-3 0  9994
     2 25544  51.6442 207.4449 0002769 310.1189 193.6568 15.48993527281553`;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const g = new Game(canvas.width, canvas.height, ISS_TLE, audioCtx);
  const gameview = new GameView(g, ctx);
  gameview.start();
  // });

  // new Game(canvas.width, canvas.height).start(canvas);
});
