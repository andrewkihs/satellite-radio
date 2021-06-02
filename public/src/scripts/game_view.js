import Game from "./game";
// import { scene, camera, renderer } from "./three/three_map";
class GameView {
  constructor(tle) {
    this.tle = tle;
    this.satRecs = [];
    this.addSatelites();
    this.date = new Date().getTime();
  }

  addSatelites() {
    const satrec = satellite.twoline2satrec(
      this.tle.split("\n")[0].trim(),
      this.tle.split("\n")[1].trim()
    );

    // let currentSatellite = new Satellite(satrec, this);
    this.satRecs.push(satrec);
    debugger;
  }

  satelliteVector = (satrec, date) => {
    debugger;
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
    var positionAndVelocity = satellite.propagate(satrec, date);
    var gmst = satellite.gstime(date);
    var positionGd = satellite.eciToGeodetic(
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
    console.log(canvasEle);
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: canvasEle,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x00fff0, 0); // sets background to clear color
    // document.body.appendChild(renderer.domElement);

    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({ color: 0xff00f0 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    const geometry = new THREE.SphereGeometry(100, 32, 32);
    const wireframe = new THREE.WireframeGeometry(geometry);

    const line = new THREE.LineSegments(wireframe);
    line.material.depthTest = false;
    // line.material.line.material.opacity = 0.25;
    line.material.transparent = true;
    scene.add(line);
    const satGeometry = new THREE.Geometry();
    // const date = new Date(activeClock.date());
    // console.log(this.satRecs);
    const satelliteVectorFunc = this.satelliteVector;
    satGeometry.vertices = this.satRecs.map((satrec) => {
      return satelliteVectorFunc(satrec, date);
    });
    const satellites = new THREE.Points(
      satGeometry,
      new THREE.PointsMaterial({ color: "pink", size: 100 })
    );
    scene.add(satellites);

    // const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    // const sphere = new THREE.Mesh(geometry, material);
    // scene.add(sphere);
    const satRecs = this.satRecs;

    camera.position.z = 1000;
    camera.position.x = -200;
    camera.position.y = 500;

    const animate = () => {
      // game.draw(ctx);
      const date = new Date();
      requestAnimationFrame(animate);
      // cube.rotation.x += 0.01;
      line.rotation.y += 0.001;
      // debugger;
      debugger;
      for (let i = 0; i < satRecs.length; i++) {
        debugger;
        satellites.geometry.vertices[i] = satelliteVectorFunc(satRecs[i], date);
      }
      renderer.render(scene, camera);
    };

    animate();
    //     outer.game.xDim = window.innerWidth;
    //     outer.game.yDim = window.innerHeight;
    //   }, 1000);
  }
}

export default GameView;
