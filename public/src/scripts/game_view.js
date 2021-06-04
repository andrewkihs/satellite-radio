import map_range from "./math_util";
class GameView {
  constructor(tleArr, audioCtx) {
    this.tleArr = tleArr;
    this.audioCtx = audioCtx;
    this.satRecs = [];
    this.satOscillators = [];
    this.addSatellites();
    this.t = 0;
    window.rate = 1;
    this.activeClock = this.clock()
      .rate(window.rate)
      .date(new Date().getTime());
    window.clock = this.activeClock;
  }

  clock() {
    let rate = 60; // 1ms elapsed : 60sec simulated
    let date = new Date().getTime();
    let elapsed = 0;

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
      if (i < 256) {
        // create oscillators for select satellites to mitigate use of memory
        this.createSatelliteOsc(satrec);
      }
    }
  }

  createSatelliteOsc(satrec) {
    const oscillatorNode = this.audioCtx.createOscillator();
    oscillatorNode.type = "sine";
    const newFreq = 100;
    oscillatorNode.frequency.value = newFreq;
    const gainNode = this.audioCtx.createGain();
    gainNode.gain.value = 0.01; // 01 %
    gainNode.connect(this.audioCtx.destination);
    oscillatorNode.connect(gainNode);
    oscillatorNode.start(0);
    this.satOscillators.push(oscillatorNode);
  }

  updateSatelliteOsc(vertices, i) {
    const newFreq = 100;
    debugger;
    const distFromCenter = Math.sqrt(
      Math.pow(vertices.x, 2) +
        Math.pow(vertices.y, 2) +
        Math.pow(vertices.z, 2)
    );
    this.satOscillators[i].frequency.value = distFromCenter;
    const currentOsc = this.satOscillators[i];
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
    const renderer = new THREE.WebGLRenderer({
      // sets renderer to existing canvas
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
    camera.position.z = 700;
    camera.position.x = 0;
    camera.position.y = 0;
    const satRecs = this.satRecs;
    const newActiveClock = this.activeClock;
    const animate = (t) => {
      const date = new Date(newActiveClock.elapsed(t).date());
      requestAnimationFrame(animate);
      line.rotation.y += (1 / 86400) * window.rate; // rotates once a day * rate of playback
      for (let i = 0; i < satRecs.length; i++) {
        satellites.geometry.vertices[i] = satelliteVectorFunc(satRecs[i], date);
        if (i < 256) {
          this.updateSatelliteOsc(satellites.geometry.vertices[i], i);
        }
      }
      satellites.geometry.verticesNeedUpdate = true;
      renderer.render(scene, camera);
    };

    animate(this.t);
  }
}

export default GameView;
