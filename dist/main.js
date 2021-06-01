/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/api_util.js":
/*!*********************************!*\
  !*** ./src/scripts/api_util.js ***!
  \*********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// const init = {
//   method: "GET",
//   headers: "Access-Control-Allow-Origin",
//   mode: "cors",
//   cache: "default",
// };
var receiveData = fetch("https://celestrak.com/NORAD/elements/gp.php?NAME=MICROSAT-R&FORMAT=JSON", {
  headers: {
    "Access-Control-Allow-Origin": "*"
  }
}).then(function (response) {
  debugger;

  if (response.status !== 200) {
    console.log("Looks like there was a problem. Status Code: " + response.status);
    return;
  } // Examine the text in the response


  response.json().then(function (data) {
    console.log(data);
  });
}).catch(function (err) {
  console.log("Fetch Error :-S", err);
});
/* harmony default export */ __webpack_exports__["default"] = (receiveData);

/***/ }),

/***/ "./src/scripts/game.js":
/*!*****************************!*\
  !*** ./src/scripts/game.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _satellite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./satellite.js */ "./src/scripts/satellite.js");
/* harmony import */ var _star_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./star.js */ "./src/scripts/star.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var Game = /*#__PURE__*/function () {
  function Game(xDim, yDim) {
    _classCallCheck(this, Game);

    this.xDim = xDim;
    this.yDim = yDim;
    this.satellites = [];
    this.stars = [];
    this.addSatellites();
    this.addStars();
  }

  _createClass(Game, [{
    key: "randomPos",
    value: function randomPos() {
      return [Math.floor(Math.random() * this.xDim), Math.floor(Math.random() * this.yDim)];
    }
  }, {
    key: "addStars",
    value: function addStars() {
      for (var i = 0; i < 1700; i++) {
        var currentStar = new _star_js__WEBPACK_IMPORTED_MODULE_1__.default(this.randomPos(), this);
        this.stars.push(currentStar);
      }
    }
  }, {
    key: "addSatellites",
    value: function addSatellites() {
      for (var i = 0; i < 4; i++) {
        var currentSatellite = new _satellite_js__WEBPACK_IMPORTED_MODULE_0__.default(this.randomPos(), [3, 4], 30, this);
        this.satellites.push(currentSatellite);
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.clearRect(0, 0, this.xDim, this.yDim);
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, this.xDim, this.yDim);
      this.stars.forEach(function (star) {
        return star.draw(ctx);
      });
      this.satellites.forEach(function (satellite) {
        return satellite.draw(ctx);
      });
    }
  }, {
    key: "move",
    value: function move(ctx) {
      this.satellites.forEach(function (satellite) {
        return satellite.move(ctx);
      });
    }
  }]);

  return Game;
}();

/* harmony default export */ __webpack_exports__["default"] = (Game);

/***/ }),

/***/ "./src/scripts/game_view.js":
/*!**********************************!*\
  !*** ./src/scripts/game_view.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _game__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./game */ "./src/scripts/game.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var GameView = /*#__PURE__*/function () {
  function GameView(game, ctx) {
    _classCallCheck(this, GameView);

    this.game = game;
    this.ctx = ctx;
  }

  _createClass(GameView, [{
    key: "start",
    value: function start() {
      var outer = this;
      setInterval(function () {
        // debugger;
        outer.game.xDim = window.innerWidth;
        outer.game.yDim = window.innerHeight;
        outer.game.move(outer.ctx);
        outer.game.draw(outer.ctx);
      }, 1000);
    }
  }]);

  return GameView;
}();

/* harmony default export */ __webpack_exports__["default"] = (GameView);

/***/ }),

/***/ "./src/scripts/satellite.js":
/*!**********************************!*\
  !*** ./src/scripts/satellite.js ***!
  \**********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Satellite = /*#__PURE__*/function () {
  function Satellite(pos, vel, radius, game) {
    _classCallCheck(this, Satellite);

    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.game = game;
  }

  _createClass(Satellite, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 10;
      ctx.fillStyle = "#46C016";
      ctx.fill();
    }
  }, {
    key: "move",
    value: function move() {
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
    }
  }]);

  return Satellite;
}();

/* harmony default export */ __webpack_exports__["default"] = (Satellite);

/***/ }),

/***/ "./src/scripts/star.js":
/*!*****************************!*\
  !*** ./src/scripts/star.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Star = /*#__PURE__*/function () {
  function Star(pos, game) {
    _classCallCheck(this, Star);

    this.pos = pos;
    this.game = game;
    this.xVal = Math.floor(Math.random() * 1) + 1;
    this.yVal = Math.floor(Math.random() * 1) + 1;
  }

  _createClass(Star, [{
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = "white";
      ctx.fillRect(this.pos[0], this.pos[1], this.xVal, this.yVal);
    }
  }]);

  return Star;
}();

/* harmony default export */ __webpack_exports__["default"] = (Star);

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _scripts_game__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scripts/game */ "./src/scripts/game.js");
/* harmony import */ var _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./scripts/game_view */ "./src/scripts/game_view.js");
/* harmony import */ var _scripts_api_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./scripts/api_util */ "./src/scripts/api_util.js");




window.addEventListener("DOMContentLoaded", function (event) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  _scripts_api_util__WEBPACK_IMPORTED_MODULE_3__.default;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var g = new _scripts_game__WEBPACK_IMPORTED_MODULE_1__.default(canvas.width, canvas.height);
  var gameview = new _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__.default(g, ctx);
  gameview.start(); // new Game(canvas.width, canvas.height).start(canvas);
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvc2NyaXB0cy9hcGlfdXRpbC5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvc2NyaXB0cy9nYW1lLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3NyYy9zY3JpcHRzL2dhbWVfdmlldy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvc2NyaXB0cy9zYXRlbGxpdGUuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vc3JjL3NjcmlwdHMvc3Rhci5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6WyJyZWNlaXZlRGF0YSIsImZldGNoIiwiaGVhZGVycyIsInRoZW4iLCJyZXNwb25zZSIsInN0YXR1cyIsImNvbnNvbGUiLCJsb2ciLCJqc29uIiwiZGF0YSIsImNhdGNoIiwiZXJyIiwiR2FtZSIsInhEaW0iLCJ5RGltIiwic2F0ZWxsaXRlcyIsInN0YXJzIiwiYWRkU2F0ZWxsaXRlcyIsImFkZFN0YXJzIiwiTWF0aCIsImZsb29yIiwicmFuZG9tIiwiaSIsImN1cnJlbnRTdGFyIiwiU3RhciIsInJhbmRvbVBvcyIsInB1c2giLCJjdXJyZW50U2F0ZWxsaXRlIiwiU2F0ZWxsaXRlIiwiY3R4IiwiY2xlYXJSZWN0IiwiZmlsbFN0eWxlIiwiZmlsbFJlY3QiLCJmb3JFYWNoIiwic3RhciIsImRyYXciLCJzYXRlbGxpdGUiLCJtb3ZlIiwiR2FtZVZpZXciLCJnYW1lIiwib3V0ZXIiLCJzZXRJbnRlcnZhbCIsIndpbmRvdyIsImlubmVyV2lkdGgiLCJpbm5lckhlaWdodCIsInBvcyIsInZlbCIsInJhZGl1cyIsImJlZ2luUGF0aCIsImFyYyIsIlBJIiwic3Ryb2tlU3R5bGUiLCJsaW5lV2lkdGgiLCJmaWxsIiwieFZhbCIsInlWYWwiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjYW52YXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZ2V0Q29udGV4dCIsIndpZHRoIiwiaGVpZ2h0IiwiZyIsImdhbWV2aWV3Iiwic3RhcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsSUFBTUEsV0FBVyxHQUFHQyxLQUFLLENBQ3ZCLHlFQUR1QixFQUV2QjtBQUNFQyxTQUFPLEVBQUU7QUFDUCxtQ0FBK0I7QUFEeEI7QUFEWCxDQUZ1QixDQUFMLENBUWpCQyxJQVJpQixDQVFaLFVBQVVDLFFBQVYsRUFBb0I7QUFDeEI7O0FBQ0EsTUFBSUEsUUFBUSxDQUFDQyxNQUFULEtBQW9CLEdBQXhCLEVBQTZCO0FBQzNCQyxXQUFPLENBQUNDLEdBQVIsQ0FDRSxrREFBa0RILFFBQVEsQ0FBQ0MsTUFEN0Q7QUFHQTtBQUNELEdBUHVCLENBU3hCOzs7QUFDQUQsVUFBUSxDQUFDSSxJQUFULEdBQWdCTCxJQUFoQixDQUFxQixVQUFVTSxJQUFWLEVBQWdCO0FBQ25DSCxXQUFPLENBQUNDLEdBQVIsQ0FBWUUsSUFBWjtBQUNELEdBRkQ7QUFHRCxDQXJCaUIsRUFzQmpCQyxLQXRCaUIsQ0FzQlgsVUFBVUMsR0FBVixFQUFlO0FBQ3BCTCxTQUFPLENBQUNDLEdBQVIsQ0FBWSxpQkFBWixFQUErQkksR0FBL0I7QUFDRCxDQXhCaUIsQ0FBcEI7QUEwQkEsK0RBQWVYLFdBQWYsRTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2pDQTtBQUNBOztJQUNNWSxJO0FBQ0osZ0JBQVlDLElBQVosRUFBa0JDLElBQWxCLEVBQXdCO0FBQUE7O0FBQ3RCLFNBQUtELElBQUwsR0FBWUEsSUFB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QUFNLENBQUNJLEtBQWhCLEVBQXVCSixNQUFNLENBQUNLLE1BQTlCLENBQVY7QUFDQSxNQUFNRSxRQUFRLEdBQUcsSUFBSTNCLHVEQUFKLENBQWEwQixDQUFiLEVBQWdCbkMsR0FBaEIsQ0FBakI7QUFDQW9DLFVBQVEsQ0FBQ0MsS0FBVCxHQVJxRCxDQVNyRDtBQUNELENBVkQsRSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29uc3QgaW5pdCA9IHtcbi8vICAgbWV0aG9kOiBcIkdFVFwiLFxuLy8gICBoZWFkZXJzOiBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiLFxuLy8gICBtb2RlOiBcImNvcnNcIixcbi8vICAgY2FjaGU6IFwiZGVmYXVsdFwiLFxuLy8gfTtcblxuY29uc3QgcmVjZWl2ZURhdGEgPSBmZXRjaChcbiAgXCJodHRwczovL2NlbGVzdHJhay5jb20vTk9SQUQvZWxlbWVudHMvZ3AucGhwP05BTUU9TUlDUk9TQVQtUiZGT1JNQVQ9SlNPTlwiLFxuICB7XG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgfSxcbiAgfVxuKVxuICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICBpZiAocmVzcG9uc2Uuc3RhdHVzICE9PSAyMDApIHtcbiAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICBcIkxvb2tzIGxpa2UgdGhlcmUgd2FzIGEgcHJvYmxlbS4gU3RhdHVzIENvZGU6IFwiICsgcmVzcG9uc2Uuc3RhdHVzXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIEV4YW1pbmUgdGhlIHRleHQgaW4gdGhlIHJlc3BvbnNlXG4gICAgcmVzcG9uc2UuanNvbigpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgIH0pO1xuICB9KVxuICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgIGNvbnNvbGUubG9nKFwiRmV0Y2ggRXJyb3IgOi1TXCIsIGVycik7XG4gIH0pO1xuXG5leHBvcnQgZGVmYXVsdCByZWNlaXZlRGF0YTtcbiIsImltcG9ydCBTYXRlbGxpdGUgZnJvbSBcIi4vc2F0ZWxsaXRlLmpzXCI7XG5pbXBvcnQgU3RhciBmcm9tIFwiLi9zdGFyLmpzXCI7XG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoeERpbSwgeURpbSkge1xuICAgIHRoaXMueERpbSA9IHhEaW07XG4gICAgdGhpcy55RGltID0geURpbTtcbiAgICB0aGlzLnNhdGVsbGl0ZXMgPSBbXTtcbiAgICB0aGlzLnN0YXJzID0gW107XG4gICAgdGhpcy5hZGRTYXRlbGxpdGVzKCk7XG4gICAgdGhpcy5hZGRTdGFycygpO1xuICB9XG5cbiAgcmFuZG9tUG9zKCkge1xuICAgIHJldHVybiBbXG4gICAgICBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLnhEaW0pLFxuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy55RGltKSxcbiAgICBdO1xuICB9XG4gIGFkZFN0YXJzKCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMTcwMDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudFN0YXIgPSBuZXcgU3Rhcih0aGlzLnJhbmRvbVBvcygpLCB0aGlzKTtcbiAgICAgIHRoaXMuc3RhcnMucHVzaChjdXJyZW50U3Rhcik7XG4gICAgfVxuICB9XG4gIGFkZFNhdGVsbGl0ZXMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgIGxldCBjdXJyZW50U2F0ZWxsaXRlID0gbmV3IFNhdGVsbGl0ZSh0aGlzLnJhbmRvbVBvcygpLCBbMywgNF0sIDMwLCB0aGlzKTtcbiAgICAgIHRoaXMuc2F0ZWxsaXRlcy5wdXNoKGN1cnJlbnRTYXRlbGxpdGUpO1xuICAgIH1cbiAgfVxuXG4gIGRyYXcoY3R4KSB7XG4gICAgY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLnhEaW0sIHRoaXMueURpbSk7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwiYmxhY2tcIjtcbiAgICBjdHguZmlsbFJlY3QoMCwgMCwgdGhpcy54RGltLCB0aGlzLnlEaW0pO1xuICAgIHRoaXMuc3RhcnMuZm9yRWFjaCgoc3RhcikgPT4gc3Rhci5kcmF3KGN0eCkpO1xuICAgIHRoaXMuc2F0ZWxsaXRlcy5mb3JFYWNoKChzYXRlbGxpdGUpID0+IHNhdGVsbGl0ZS5kcmF3KGN0eCkpO1xuICB9XG5cbiAgbW92ZShjdHgpIHtcbiAgICB0aGlzLnNhdGVsbGl0ZXMuZm9yRWFjaCgoc2F0ZWxsaXRlKSA9PiBzYXRlbGxpdGUubW92ZShjdHgpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuXG5jbGFzcyBHYW1lVmlldyB7XG4gIGNvbnN0cnVjdG9yKGdhbWUsIGN0eCkge1xuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBvdXRlciA9IHRoaXM7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZGVidWdnZXI7XG4gICAgICBvdXRlci5nYW1lLnhEaW0gPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgIG91dGVyLmdhbWUueURpbSA9IHdpbmRvdy5pbm5lckhlaWdodDtcbiAgICAgIG91dGVyLmdhbWUubW92ZShvdXRlci5jdHgpO1xuICAgICAgb3V0ZXIuZ2FtZS5kcmF3KG91dGVyLmN0eCk7XG4gICAgfSwgMTAwMCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgR2FtZVZpZXc7XG4iLCJjbGFzcyBTYXRlbGxpdGUge1xuICBjb25zdHJ1Y3Rvcihwb3MsIHZlbCwgcmFkaXVzLCBnYW1lKSB7XG4gICAgdGhpcy5wb3MgPSBwb3M7XG4gICAgdGhpcy52ZWwgPSB2ZWw7XG4gICAgdGhpcy5yYWRpdXMgPSByYWRpdXM7XG4gICAgdGhpcy5nYW1lID0gZ2FtZTtcbiAgfVxuXG4gIGRyYXcoY3R4KSB7XG4gICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgIGN0eC5hcmModGhpcy5wb3NbMF0sIHRoaXMucG9zWzFdLCB0aGlzLnJhZGl1cywgMCwgMiAqIE1hdGguUEksIHRydWUpO1xuICAgIGN0eC5zdHJva2VTdHlsZSA9IFwiYmx1ZVwiO1xuICAgIGN0eC5saW5lV2lkdGggPSAxMDtcbiAgICBjdHguZmlsbFN0eWxlID0gXCIjNDZDMDE2XCI7XG4gICAgY3R4LmZpbGwoKTtcbiAgfVxuXG4gIG1vdmUoKSB7XG4gICAgdGhpcy5wb3NbMF0gKz0gdGhpcy52ZWxbMF07XG4gICAgdGhpcy5wb3NbMV0gKz0gdGhpcy52ZWxbMV07XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2F0ZWxsaXRlO1xuIiwiY2xhc3MgU3RhciB7XG4gIGNvbnN0cnVjdG9yKHBvcywgZ2FtZSkge1xuICAgIHRoaXMucG9zID0gcG9zO1xuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgdGhpcy54VmFsID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMSkgKyAxO1xuICAgIHRoaXMueVZhbCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDEpICsgMTtcbiAgfVxuXG4gIGRyYXcoY3R4KSB7XG4gICAgY3R4LmZpbGxTdHlsZSA9IFwid2hpdGVcIjtcbiAgICBjdHguZmlsbFJlY3QodGhpcy5wb3NbMF0sIHRoaXMucG9zWzFdLCB0aGlzLnhWYWwsIHRoaXMueVZhbCk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3RhcjtcbiIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpblxuZXhwb3J0IHt9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCBcIi4vc3R5bGVzL2luZGV4LnNjc3NcIjtcbmltcG9ydCBHYW1lIGZyb20gXCIuL3NjcmlwdHMvZ2FtZVwiO1xuaW1wb3J0IEdhbWVWaWV3IGZyb20gXCIuL3NjcmlwdHMvZ2FtZV92aWV3XCI7XG5pbXBvcnQgcmVjZWl2ZURhdGEgZnJvbSBcIi4vc2NyaXB0cy9hcGlfdXRpbFwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuICByZWNlaXZlRGF0YTtcbiAgY2FudmFzLndpZHRoID0gd2luZG93LmlubmVyV2lkdGg7XG4gIGNhbnZhcy5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIGNvbnN0IGcgPSBuZXcgR2FtZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICBjb25zdCBnYW1ldmlldyA9IG5ldyBHYW1lVmlldyhnLCBjdHgpO1xuICBnYW1ldmlldy5zdGFydCgpO1xuICAvLyBuZXcgR2FtZShjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpLnN0YXJ0KGNhbnZhcyk7XG59KTtcbiJdLCJzb3VyY2VSb290IjoiIn0=