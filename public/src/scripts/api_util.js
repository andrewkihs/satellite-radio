const axios = require("axios");

let isbn = "0201558025";

const receiveData = axios
  .get(`/satellites/tle`)
  .then((response) => {
    const split = response.data.split("\r\n");
    let newData = [];
    for (let i = 0; i < split.length - 2; i += 3) {
      const two = split[i + 1].concat(" ", "\n", " ", split[i + 2]);
      newData.push(two);
    }
    return newData;
  })
  .catch(function (error) {
    console.log(error);
  });

export default receiveData;
