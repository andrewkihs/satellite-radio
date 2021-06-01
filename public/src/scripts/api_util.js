// const init = {
//   method: "GET",
//   headers: "Access-Control-Allow-Origin",
//   mode: "cors",
//   cache: "default",
// };

const axios = require("axios");

const receiveData = axios
  .get(`/books/0201558025`)
  .then((response) => {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

export default receiveData;
