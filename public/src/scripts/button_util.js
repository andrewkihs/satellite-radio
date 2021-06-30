const handleAudioPlay = (audioContext) => {
  const audioCtx = audioContext;
  const button = document.getElementById("play_pause");
  button.addEventListener(
    "click",
    function () {
      if (audioCtx.state === "suspended") {
        audioCtx.resume();
        var oscillator = audioCtx.createOscillator();

        oscillator.type = "square";
        oscillator.frequency.value = 440; // value in hertz
        oscillator.start(0);
      } else {
        audioCtx.suspend();
      }
    },
    false
  );
};

const handlePlaybackSpeed = () => {
  const slider = document.getElementById("playback-slider");
  slider.addEventListener(
    "change",
    function () {
      let playbackRate = slider.value;
      window.clock.rate(playbackRate);
      window.rate = playbackRate;
    },
    false
  );
};

const handleAllButtons = (audioContext) => {
  handleAudioPlay(audioContext);
  handlePlaybackSpeed();
};

export default handleAllButtons;
