import "./styles/index.scss";
import GameView from "./scripts/game_view";
import receiveData from "./scripts/api_util";
import handleAllButtons from "./scripts/button_util";
import handleStart from "./scripts/handle_start";
window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");

  handleStart().then(() => {
    const audioCtx = new AudioContext();
    handleAllButtons(audioCtx);

    receiveData.then((response) => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const gameview = new GameView(response, audioCtx);
      gameview.start();
    });
  });
});
