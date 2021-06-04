const handlePlay = (audioContext) => {
  const audioCtx = audioContext;
  const button = document.getElementById("play_pause");
  button.addEventListener(
    "click",
    function () {
      console.log("clicked");
      if (audioCtx.state === "suspended") {
        debugger;
        audioCtx.resume();
        var oscillator = audioCtx.createOscillator();

        oscillator.type = "square";
        oscillator.frequency.value = 440; // value in hertz
        oscillator.start(0);
        // oscillator.connect(audioCtx.destination);
        // debugger;
      } else {
        audioCtx.suspend();
      }
    },
    false
  );
};

export const handleButton = () => {
  document.getElementById("abt-btn").addEventListener("click", function () {
    document.getElementById("overlay").classList.add("is-visible");
    document.getElementByIdI("abt-modal").classList.add("is-visible");
  });
};

export default handlePlay;
