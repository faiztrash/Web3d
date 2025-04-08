const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 900 / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(900, 500);

const container = document.getElementById('snackViewer');
container.style.display = 'flex';
container.style.justifyContent = 'center';
container.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xf0f0f0);

//Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const lights = [
  [5, 10, 7.5], [-5, 10, -7.5], [0, 10, 0], [0, -10, 0], [10, 0, 0], [-10, 0, 0]
];
lights.forEach(pos => {
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(...pos);
  scene.add(light);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

const loader = new THREE.GLTFLoader();
let currentModel;

function loadModel(path) {
  if (currentModel) {
    scene.remove(currentModel);
  }

  loader.load(path, function (gltf) {
    currentModel = gltf.scene;
    currentModel.scale.set(1, 1, 1);

    //Rotate Cool Ranch to match front-facing orientation
    if (path.includes("Cool ranch.glb") || path.includes("Cool%20ranch.glb")) {
      currentModel.rotation.y = Math.PI;
    }

    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    currentModel.position.sub(center);
    scene.add(currentModel);

    //Adjust camera position
    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = camera.fov * (Math.PI / 180);
    let cameraZ = Math.abs(maxDim / Math.sin(fov / 2));
    cameraZ *= 0.6;

    camera.position.set(0, 1.5, cameraZ);
    camera.lookAt(0, 0, 0);

    controls.target.set(0, 0, 0);
    controls.update();
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

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

loadModel('models/Doritos.glb');
