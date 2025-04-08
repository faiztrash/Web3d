// snacks.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById('snackViewer').appendChild(renderer.domElement);

scene.background = new THREE.Color(0xf0f0f0);

const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
light.position.set(0, 20, 0);
scene.add(light);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const loader = new THREE.GLTFLoader();
let currentModel;

function loadModel(path) {
  if (currentModel) {
    scene.remove(currentModel);
  }
  loader.load(path, function (gltf) {
    currentModel = gltf.scene;
    currentModel.scale.set(1, 1, 1);
    scene.add(currentModel);
  }, undefined, function (error) {
    console.error('Error loading model:', error);
  });
}

function resetModel() {
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
  }
}

camera.position.set(2, 1.5, 4);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Load default model
loadModel('models/Doritos.glb');
