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

//Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

//Controls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

//Load Model
const loader = new THREE.GLTFLoader();
loader.load('models/boarding-pass.glb', function (gltf) {
  const model = gltf.scene;
  model.scale.set(1.5, 1.5, 1.5);

  model.rotation.x = -Math.PI / -4; 
  model.rotation.y = Math.PI / 6;  

  const box = new THREE.Box3().setFromObject(model);
  const center = box.getCenter(new THREE.Vector3());
  model.position.sub(center);
  model.position.y += 0.2;

  scene.add(model);
  controls.target.set(0, 0, 0);
  controls.update();
  camera.lookAt(0, 0, 0);
});

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();
