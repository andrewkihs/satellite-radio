import "./styles/index.scss";
import GameView from "./scripts/game_view";
import receiveData from "./scripts/api_util";
import handleAllButtons from "./scripts/button_util";
import handleStart from "./scripts/handle_start";
import handleModal from "./scripts/handle_modal";
window.addEventListener("DOMContentLoaded", (event) => {
  const canvas = document.getElementById("canvas");
  handleModal();
  handleStart().then(() => {
    const audioCtx = new AudioContext();
    const startScreen = document.getElementById("start-screen");
    startScreen.style.display = "none";
    const bottomUiButtons = document.getElementById("bottom-ui-buttons");
    bottomUiButtons.style.display = "flex";
    handleAllButtons(audioCtx);

    receiveData.then((response) => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const gameview = new GameView(response, audioCtx);
      gameview.start();
    });
  });
});
