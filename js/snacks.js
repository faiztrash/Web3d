const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 900 / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(900, 500);

const container = document.getElementById('snackViewer');
container.style.display = 'flex';
container.style.justifyContent = 'center';
container.appendChild(renderer.domElement);

scene.background = new THREE.Color(0xf0f0f0);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);
// Add a directional light to simulate sunlight
const lights = [
  [5, 10, 7.5], [-5, 10, -7.5], [0, 10, 0], [0, -10, 0], [10, 0, 0], [-10, 0, 0]
];
lights.forEach(pos => {
  const light = new THREE.DirectionalLight(0xffffff, 0.5);
  light.position.set(...pos);
  scene.add(light);
});
// Add a hemisphere light to simulate ambient light
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

const loader = new THREE.GLTFLoader();
let currentModel;
let wireframeEnabled = false;
const wireframes = [];
// Add a button to toggle wireframe mode
function applyWireframes(object) {
  object.traverse(function (child) {
    if (child.isMesh) {
      const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        wireframe: true
      });
      const wireframe = new THREE.Mesh(child.geometry, wireframeMaterial);
      wireframe.position.copy(child.position);
      wireframe.rotation.copy(child.rotation);
      wireframe.scale.copy(child.scale);
      child.add(wireframe);
      wireframes.push(wireframe);
    }
  });
}

function removeWireframes() {
  wireframes.forEach(wf => {
    if (wf.parent) {
      wf.parent.remove(wf);
    }
  });
  wireframes.length = 0;
}
// Add event listeners to the buttons
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


function loadModel(path) {
  if (currentModel) {
    scene.remove(currentModel);
    currentModel = null;
    removeWireframes();
    wireframeEnabled = false;
  }

  loader.load(path, function (gltf) {
    currentModel = gltf.scene;
    currentModel.scale.set(1, 1, 1);

    if (path.includes("Cool ranch.glb") || path.includes("Cool%20ranch.glb")) {
      currentModel.rotation.y = Math.PI;
    }

    const box = new THREE.Box3().setFromObject(currentModel);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());

    currentModel.position.sub(center);
    scene.add(currentModel);

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
    removeWireframes();
    currentModel = null;
    wireframeEnabled = false;
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

loadModel('models/Doritos.glb');
