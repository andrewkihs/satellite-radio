// const init = {
//   method: "GET",
//   headers: "Access-Control-Allow-Origin",
//   mode: "cors",
//   cache: "default",
// };

const axios = require("axios");

let isbn = "0201558025";

const receiveData = axios
  .get(`/satellites/active`)
  .then((response) => {
    console.log(response);
    return response;
  })
  .catch(function (error) {
    console.log(error);
  });

export default receiveData;
