const handleStart = () => {
  const button = document.getElementById("start-viz-btn");
  return new Promise(
    (resolve, reject) => {
      button.addEventListener("click", () => {
        resolve("Sim started, button clicked");
      });
    },
    { once: true }
  );
};

export default handleStart;
