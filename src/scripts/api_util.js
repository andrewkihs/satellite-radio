// const init = {
//   method: "GET",
//   headers: "Access-Control-Allow-Origin",
//   mode: "cors",
//   cache: "default",
// };

const receiveData = fetch(
  "https://celestrak.com/NORAD/elements/gp.php?NAME=MICROSAT-R&FORMAT=JSON",
  {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  }
)
  .then(function (response) {
    debugger;
    if (response.status !== 200) {
      console.log(
        "Looks like there was a problem. Status Code: " + response.status
      );
      return;
    }

    // Examine the text in the response
    response.json().then(function (data) {
      console.log(data);
    });
  })
  .catch(function (err) {
    console.log("Fetch Error :-S", err);
  });

export default receiveData;
