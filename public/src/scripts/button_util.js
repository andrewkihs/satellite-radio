const handlePlay = (audioContext) => {
  debugger;
  const audioCtx = audioContext;
  const button = document.getElementById("play_pause");
  button.addEventListener(
    "click",
    function () {
      console.log("clicked");
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
        var oscillator = audioCtx.createOscillator();

        oscillator.type = "square";
        oscillator.frequency.value = 440; // value in hertz
        oscillator.start(0);
        // oscillator.connect(audioCtx.destination);
        debugger;
      } else {
        audioCtx.suspend();
      }
    },
    false
  );
};

export default handlePlay;
