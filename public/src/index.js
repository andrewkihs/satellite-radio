import "./styles/index.scss";
import Game from "./scripts/game";
import GameView from "./scripts/game_view";
import receiveData from "./scripts/api_util";
import handlePlay from "./scripts/button_util";
// import readTLE from "./scripts/tle/tle_parse";
window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");

  const audioCtx = new AudioContext();
  handlePlay(audioCtx);
  // readTLE;
  receiveData.then((response) => {
    const ISS_TLE = `1 27651U 03004A   21153.50481762  .00000064  00000+0  20724-4 0  9991
    2 27651  39.9940 177.6513 0023168 320.1011  39.8075 14.89306556996390`;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const g = new Game(canvas.width, canvas.height, ISS_TLE, audioCtx);
    const gameview = new GameView(response, audioCtx);
    gameview.start();
  });
  // });

  // new Game(canvas.width, canvas.height).start(canvas);
});
