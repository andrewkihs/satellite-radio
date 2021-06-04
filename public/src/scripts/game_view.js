import Game from "./game";
import map_range from "./math_util";
// import { scene, camera, renderer } from "./three/three_map";
class GameView {
  constructor(tleArr, audioCtx) {
    this.tleArr = tleArr;
    this.audioCtx = audioCtx;
    this.satRecs = [];
    this.satOscillators = [];
    this.addSatellites();
    this.t = 0;
    this.activeClock = this.clock().rate(100).date(new Date().getTime());
  }

  clock() {
    var rate = 60; // 1ms elapsed : 60sec simulated
    var date = new Date().getTime();
    var elapsed = 0;

    function clock() {}

    clock.date = function (timeInMs) {
      if (!arguments.length) return date + elapsed * rate;
      date = timeInMs;
      return clock;
    };

    clock.elapsed = function (ms) {
      if (!arguments.length) return date - new Date().getTime(); // calculates elapsed
      elapsed = ms;
      // debugger;
      return clock;
    };

    clock.rate = function (secondsPerMsElapsed) {
      if (!arguments.length) return rate;
      rate = secondsPerMsElapsed;
      return clock;
    };

    return clock;
  }
  addSatellites() {
    for (let i = 0; i < this.tleArr.length; i++) {
      let satrec = satellite.twoline2satrec(
        this.tleArr[i].split("\n")[0].trim(),
        this.tleArr[i].split("\n")[1].trim()
      );
      this.satRecs.push(satrec);
      this.createSatelliteOsc(satrec);
    }
  }

  createSatelliteOsc(satrec) {
    const oscillatorNode = this.audioCtx.createOscillator();
    oscillatorNode.type = "sine";
    // console.log(satrec);
    // debugger;
    // const newFreq = (satrec.epochdays * satrec.d3) % 2050;
    const newFreq = 100;
    oscillatorNode.frequency.value = newFreq;
    // console.log(newFreq);
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.01; // 10 %
    gainNode.connect(this.audioCtx.destination);
    oscillatorNode.connect(gainNode);
    oscillatorNode.start(0);
    this.satOscillators.push(oscillatorNode);
  }

  updateSatelliteOsc(vertices, i) {
    const currentOsc = this.satOscillators[i];
    // const cutFreq = Math.abs(vertices.x);

    // debugger;
    // currentOsc.frequency.value = 400;
    // Math.abs(vertices.x * vertices.y * vertices.z);
    // const newFreq = map_range(satrec.size, 0, this.game.yDim, 0, 20000);
  }

  satelliteVector = (satrec, date) => {
    const xyz = this.satrecToXYZ(satrec, date);
    const lambda = xyz[0];
    const phi = xyz[1];
    const cosPhi = Math.cos(phi);
    const r = ((xyz[2] + 6371) / 6371) * 228;
    return new THREE.Vector3(
      r * cosPhi * Math.cos(lambda),
      r * cosPhi * Math.sin(lambda),
      r * Math.sin(phi)
    );
  };
  satrecToXYZ = (satrec, date) => {
    const positionAndVelocity = satellite.propagate(satrec, date);
    const gmst = satellite.gstime(date);
    const positionGd = satellite.eciToGeodetic(
      positionAndVelocity.position,
      gmst
    );
    return [positionGd.longitude, positionGd.latitude, positionGd.height];
  };

  start() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const date = new Date();
    const canvasEle = document.getElementById("canvas");
    // debugger;
    // console.log(canvasEle);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasEle,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x00fff0, 0); // sets background to clear color

    const geometry = new THREE.SphereGeometry(200, 32, 32);
    const wireframe = new THREE.WireframeGeometry(geometry);

    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    line.material.transparent = true;
    scene.add(line);
    const satGeometry = new THREE.Geometry();
    const satelliteVectorFunc = this.satelliteVector;
    satGeometry.vertices = this.satRecs.map((satrec) => {
      return satelliteVectorFunc(satrec, date);
    });
    const satellites = new THREE.Points(
      satGeometry,
      new THREE.PointsMaterial({ color: "green", size: 4 })
    );
    scene.add(satellites);
    debugger;
    camera.position.z = 700;
    camera.position.x = 0;
    camera.position.y = 0;
    const satRecs = this.satRecs;
    const newActiveClock = this.activeClock;
    // const updateOscillators = this.updateSatelliteOsc;
    const animate = (t) => {
      const date = new Date(newActiveClock.elapsed(t).date());
      requestAnimationFrame(animate);
      line.rotation.y += 0.001;
      for (let i = 0; i < satRecs.length; i++) {
        satellites.geometry.vertices[i] = satelliteVectorFunc(satRecs[i], date);
        this.updateSatelliteOsc(satellites.geometry.vertices[i], i);
      }
      satellites.geometry.verticesNeedUpdate = true;
      renderer.render(scene, camera);
    };

    animate(this.t);
  }
}

export default GameView;
