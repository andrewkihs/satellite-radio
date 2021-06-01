/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/game.js":
/*!*****************************!*\
  !*** ./src/scripts/game.js ***!
  \*****************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _satellite_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./satellite.js */ "./src/scripts/satellite.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Game = /*#__PURE__*/function () {
  function Game(xDim, yDim) {
    _classCallCheck(this, Game);

    this.xDim = xDim;
    this.yDim = yDim;
    this.satellites = [];
    this.addSatellites();
  }

  _createClass(Game, [{
    key: "randomPos",
    value: function randomPos() {
      return [Math.floor(Math.random() * this.xDim), Math.floor(Math.random() * this.yDim)];
    }
  }, {
    key: "addSatellites",
    value: function addSatellites() {
      for (var i = 0; i < 4; i++) {
        var _currentSatellite = new _satellite_js__WEBPACK_IMPORTED_MODULE_0__.default(this.randomPos(), [3, 4], 30, this); // debugger;


        this.satellites.push(_currentSatellite);
      }

      var markerSatellite = new _satellite_js__WEBPACK_IMPORTED_MODULE_0__.default([0, 1], 6, 20, this);
      this.satellites.push(markerSatellite);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.clearRect(0, 0, this.xDim, this.yDim);
      debugger;
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
  }, {
    key: "start",
    value: function start(canvasEl) {
      var _this = this;

      debugger;
      var ctx = canvasEl.getContext("2d"); //this function will update the position of all the circles,
      //clear the canvas, and redraw them

      var animateCallback = function animateCallback() {
        // this.moveCircles();
        // let currentSatellite = new Satellite(this.randomPos(), 5, 5, this);
        currentSatellite.draw(ctx); // Satellite.draw(ctx);

        _this.render(ctx); //this will call our animateCallback again, but only when the browser
        //is ready, usually every 1/60th of a second


        requestAnimationFrame(animateCallback);
      };

      animateCallback();
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
      debugger;
      setInterval(function () {
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
      debugger;
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
      debugger;
      this.pos[0] += this.vel[0];
      this.pos[1] += this.vel[1];
    }
  }]);

  return Satellite;
}();

/* harmony default export */ __webpack_exports__["default"] = (Satellite);

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



window.addEventListener("DOMContentLoaded", function (event) {
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var g = new _scripts_game__WEBPACK_IMPORTED_MODULE_1__.default(canvas.width, canvas.height);
  var gameview = new _scripts_game_view__WEBPACK_IMPORTED_MODULE_2__.default(g, ctx);
  gameview.start(); // new Game(canvas.width, canvas.height).start(canvas);
});
}();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvc2NyaXB0cy9nYW1lLmpzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby8uL3NyYy9zY3JpcHRzL2dhbWVfdmlldy5qcyIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvc2NyaXB0cy9zYXRlbGxpdGUuanMiLCJ3ZWJwYWNrOi8vc2F0ZWxsaXRlLXJhZGlvLy4vc3JjL3N0eWxlcy9pbmRleC5zY3NzIiwid2VicGFjazovL3NhdGVsbGl0ZS1yYWRpby93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zYXRlbGxpdGUtcmFkaW8vLi9zcmMvaW5kZXguanMiXSwibmFtZXMiOlsiR2FtZSIsInhEaW0iLCJ5RGltIiwic2F0ZWxsaXRlcyIsImFkZFNhdGVsbGl0ZXMiLCJNYXRoIiwiZmxvb3IiLCJyYW5kb20iLCJpIiwiY3VycmVudFNhdGVsbGl0ZSIsIlNhdGVsbGl0ZSIsInJhbmRvbVBvcyIsInB1c2giLCJtYXJrZXJTYXRlbGxpdGUiLCJjdHgiLCJjbGVhclJlY3QiLCJmb3JFYWNoIiwic2F0ZWxsaXRlIiwiZHJhdyIsIm1vdmUiLCJjYW52YXNFbCIsImdldENvbnRleHQiLCJhbmltYXRlQ2FsbGJhY2siLCJyZW5kZXIiLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJHYW1lVmlldyIsImdhbWUiLCJvdXRlciIsInNldEludGVydmFsIiwicG9zIiwidmVsIiwicmFkaXVzIiwiYmVnaW5QYXRoIiwiYXJjIiwiUEkiLCJzdHJva2VTdHlsZSIsImxpbmVXaWR0aCIsImZpbGxTdHlsZSIsImZpbGwiLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJjYW52YXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwid2lkdGgiLCJpbm5lcldpZHRoIiwi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QTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0Esc0RBQXNELGtCQUFrQjtXQUN4RTtXQUNBLCtDQUErQyxjQUFjO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7O0FDTkE7QUFDQTtBQUNBO0FBRUE2QixNQUFNLENBQUNDLGdCQUFQLENBQXdCLGtCQUF4QixFQUE0QyxVQUFDQyxLQUFELEVBQVc7QUFDckQsTUFBTUMsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsQ0FBZjtBQUNBLE1BQU05QixHQUFHLEdBQUc0QixNQUFNLENBQUNyQixVQUFQLENBQWtCLElBQWxCLENBQVo7QUFFQXFCLFFBQU0sQ0FBQ0csS0FBUCxHQUFlTixNQUFNLENBQUNPLFVBQXRCO0FBQ0FKLFFBQU0sQ0FBQ0ssTUFBUCxHQUFnQlIsTUFBTSxDQUFDUyxXQUF2QjtBQUNBLE1BQU1DLENBQUMsR0FBRyxJQUFJakQsa0RBQUosQ0FBUzBDLE1BQU0sQ0FBQ0csS0FBaEIsRUFBdUJILE1BQU0sQ0FBQ0ssTUFBOUIsQ0FBVjtBQUNBLE1BQU1HLFFBQVEsR0FBRyxJQUFJekIsdURBQUosQ0FBYXdCLENBQWIsRUFBZ0JuQyxHQUFoQixDQUFqQjtBQUNBb0MsVUFBUSxDQUFDQyxLQUFULEdBUnFELENBU3JEO0FBQ0QsQ0FWRCxFIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgU2F0ZWxsaXRlIGZyb20gXCIuL3NhdGVsbGl0ZS5qc1wiO1xuXG5jbGFzcyBHYW1lIHtcbiAgY29uc3RydWN0b3IoeERpbSwgeURpbSkge1xuICAgIHRoaXMueERpbSA9IHhEaW07XG4gICAgdGhpcy55RGltID0geURpbTtcbiAgICB0aGlzLnNhdGVsbGl0ZXMgPSBbXTtcbiAgICB0aGlzLmFkZFNhdGVsbGl0ZXMoKTtcbiAgfVxuXG4gIHJhbmRvbVBvcygpIHtcbiAgICByZXR1cm4gW1xuICAgICAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy54RGltKSxcbiAgICAgIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMueURpbSksXG4gICAgXTtcbiAgfVxuXG4gIGFkZFNhdGVsbGl0ZXMoKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgIGxldCBjdXJyZW50U2F0ZWxsaXRlID0gbmV3IFNhdGVsbGl0ZSh0aGlzLnJhbmRvbVBvcygpLCBbMywgNF0sIDMwLCB0aGlzKTtcbiAgICAgIC8vIGRlYnVnZ2VyO1xuICAgICAgdGhpcy5zYXRlbGxpdGVzLnB1c2goY3VycmVudFNhdGVsbGl0ZSk7XG4gICAgfVxuICAgIGxldCBtYXJrZXJTYXRlbGxpdGUgPSBuZXcgU2F0ZWxsaXRlKFswLCAxXSwgNiwgMjAsIHRoaXMpO1xuICAgIHRoaXMuc2F0ZWxsaXRlcy5wdXNoKG1hcmtlclNhdGVsbGl0ZSk7XG4gIH1cblxuICBkcmF3KGN0eCkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy54RGltLCB0aGlzLnlEaW0pO1xuICAgIGRlYnVnZ2VyO1xuICAgIHRoaXMuc2F0ZWxsaXRlcy5mb3JFYWNoKChzYXRlbGxpdGUpID0+IHNhdGVsbGl0ZS5kcmF3KGN0eCkpO1xuICB9XG5cbiAgbW92ZShjdHgpIHtcbiAgICB0aGlzLnNhdGVsbGl0ZXMuZm9yRWFjaCgoc2F0ZWxsaXRlKSA9PiBzYXRlbGxpdGUubW92ZShjdHgpKTtcbiAgfVxuXG4gIHN0YXJ0KGNhbnZhc0VsKSB7XG4gICAgZGVidWdnZXI7XG4gICAgY29uc3QgY3R4ID0gY2FudmFzRWwuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gICAgLy90aGlzIGZ1bmN0aW9uIHdpbGwgdXBkYXRlIHRoZSBwb3NpdGlvbiBvZiBhbGwgdGhlIGNpcmNsZXMsXG4gICAgLy9jbGVhciB0aGUgY2FudmFzLCBhbmQgcmVkcmF3IHRoZW1cbiAgICBjb25zdCBhbmltYXRlQ2FsbGJhY2sgPSAoKSA9PiB7XG4gICAgICAvLyB0aGlzLm1vdmVDaXJjbGVzKCk7XG4gICAgICAvLyBsZXQgY3VycmVudFNhdGVsbGl0ZSA9IG5ldyBTYXRlbGxpdGUodGhpcy5yYW5kb21Qb3MoKSwgNSwgNSwgdGhpcyk7XG4gICAgICBjdXJyZW50U2F0ZWxsaXRlLmRyYXcoY3R4KTtcbiAgICAgIC8vIFNhdGVsbGl0ZS5kcmF3KGN0eCk7XG4gICAgICB0aGlzLnJlbmRlcihjdHgpO1xuICAgICAgLy90aGlzIHdpbGwgY2FsbCBvdXIgYW5pbWF0ZUNhbGxiYWNrIGFnYWluLCBidXQgb25seSB3aGVuIHRoZSBicm93c2VyXG4gICAgICAvL2lzIHJlYWR5LCB1c3VhbGx5IGV2ZXJ5IDEvNjB0aCBvZiBhIHNlY29uZFxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGFuaW1hdGVDYWxsYmFjayk7XG4gICAgfTtcbiAgICBhbmltYXRlQ2FsbGJhY2soKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lO1xuIiwiaW1wb3J0IEdhbWUgZnJvbSBcIi4vZ2FtZVwiO1xuXG5jbGFzcyBHYW1lVmlldyB7XG4gIGNvbnN0cnVjdG9yKGdhbWUsIGN0eCkge1xuICAgIHRoaXMuZ2FtZSA9IGdhbWU7XG4gICAgdGhpcy5jdHggPSBjdHg7XG4gIH1cblxuICBzdGFydCgpIHtcbiAgICBjb25zdCBvdXRlciA9IHRoaXM7XG4gICAgZGVidWdnZXI7XG4gICAgc2V0SW50ZXJ2YWwoZnVuY3Rpb24gKCkge1xuICAgICAgb3V0ZXIuZ2FtZS5tb3ZlKG91dGVyLmN0eCk7XG4gICAgICBvdXRlci5nYW1lLmRyYXcob3V0ZXIuY3R4KTtcbiAgICB9LCAxMDAwKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBHYW1lVmlldztcbiIsImNsYXNzIFNhdGVsbGl0ZSB7XG4gIGNvbnN0cnVjdG9yKHBvcywgdmVsLCByYWRpdXMsIGdhbWUpIHtcbiAgICB0aGlzLnBvcyA9IHBvcztcbiAgICB0aGlzLnZlbCA9IHZlbDtcbiAgICB0aGlzLnJhZGl1cyA9IHJhZGl1cztcbiAgICB0aGlzLmdhbWUgPSBnYW1lO1xuICB9XG5cbiAgZHJhdyhjdHgpIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgY3R4LmFyYyh0aGlzLnBvc1swXSwgdGhpcy5wb3NbMV0sIHRoaXMucmFkaXVzLCAwLCAyICogTWF0aC5QSSwgdHJ1ZSk7XG4gICAgY3R4LnN0cm9rZVN0eWxlID0gXCJibHVlXCI7XG4gICAgY3R4LmxpbmVXaWR0aCA9IDEwO1xuICAgIGN0eC5maWxsU3R5bGUgPSBcIiM0NkMwMTZcIjtcbiAgICBjdHguZmlsbCgpO1xuICB9XG5cbiAgbW92ZSgpIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICB0aGlzLnBvc1swXSArPSB0aGlzLnZlbFswXTtcbiAgICB0aGlzLnBvc1sxXSArPSB0aGlzLnZlbFsxXTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTYXRlbGxpdGU7XG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5zY3NzXCI7XG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9zY3JpcHRzL2dhbWVcIjtcbmltcG9ydCBHYW1lVmlldyBmcm9tIFwiLi9zY3JpcHRzL2dhbWVfdmlld1wiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKGV2ZW50KSA9PiB7XG4gIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY2FudmFzXCIpO1xuICBjb25zdCBjdHggPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xuXG4gIGNhbnZhcy53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICBjYW52YXMuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICBjb25zdCBnID0gbmV3IEdhbWUoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgY29uc3QgZ2FtZXZpZXcgPSBuZXcgR2FtZVZpZXcoZywgY3R4KTtcbiAgZ2FtZXZpZXcuc3RhcnQoKTtcbiAgLy8gbmV3IEdhbWUoY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KS5zdGFydChjYW52YXMpO1xufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9