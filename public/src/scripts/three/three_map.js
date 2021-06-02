// var TLE_DATA_DATE = new Date(2018, 0, 26).getTime();

// const width = 960,
//   height = 500,
//   radius = 228,
//   scene = new THREE.Scene(),
//   camera = new THREE.PerspectiveCamera(70, width / height, 1, 10000),
//   renderer = new THREE.WebGLRenderer({ alpha: true }),
//   controls = new (OrbitControls(THREE))(camera, renderer.domElement),
//   dateElement = document.getElementById("date-time"),
//   satrecs,
//   satellites,
//   graticule,
//   countries,
//   activeClock;
export const scene = new THREE.Scene();
export const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

export const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
