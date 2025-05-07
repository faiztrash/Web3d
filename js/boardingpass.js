
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

const aspect = window.innerWidth / 500;
const d = 2;
const camera = new THREE.OrthographicCamera(
    -d * aspect, d * aspect,
    d, -d,
    0.1, 1000
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(900, 500);
document.getElementById('modelViewer').appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

const loader = new THREE.GLTFLoader();
let currentModel;
let wireframeEnabled = false;

loader.load('models/boarding-pass.glb', function (gltf) {
  currentModel = gltf.scene;
  currentModel.scale.set(1.5, 1.5, 1.5);

  // Model position and rotation
  currentModel.rotation.x = -Math.PI / 4; 
  currentModel.rotation.y = Math.PI / 6;  

  const box = new THREE.Box3().setFromObject(currentModel);
  const center = box.getCenter(new THREE.Vector3());
  currentModel.position.sub(center);
  currentModel.position.y += 0.2;

  scene.add(currentModel);
  controls.target.set(0, 0, 0);
  controls.update();
  camera.lookAt(0, 0, 0);
}, undefined, function (error) {
  console.error('Error loading boarding pass:', error);
});

document.getElementById('toggleWireframe').addEventListener('click', () => {
  if (currentModel) {
    currentModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = !wireframeEnabled;
      }
    });
    wireframeEnabled = !wireframeEnabled;
  }
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
