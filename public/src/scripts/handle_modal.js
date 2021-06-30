const handleModal = () => {
  document.getElementById("abt-btn").addEventListener("click", function () {
    document.getElementById("overlay").classList.add("is-visible");
    document.getElementById("abt-modal").classList.add("is-visible");
  });

  document.getElementById("close-btn").addEventListener("click", function () {
    document.getElementById("overlay").classList.remove("is-visible");
    document.getElementById("abt-modal").classList.remove("is-visible");
  });
  document.getElementById("overlay").addEventListener("click", function () {
    document.getElementById("overlay").classList.remove("is-visible");
    document.getElementById("abt-modal").classList.remove("is-visible");
  });
};

export default handleModal;
