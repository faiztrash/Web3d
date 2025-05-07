const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / 500, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById('modelViewer').appendChild(renderer.domElement);

scene.background = new THREE.Color(0xf0f0f0);

//Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const lightPositions = [
  [5, 10, 7.5], [-5, 10, -7.5], [0, 10, 0], [0, -10, 0], [10, 0, 0], [-10, 0, 0]
];

lightPositions.forEach(pos => {
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(...pos);
  scene.add(directionalLight);
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();

const loader = new THREE.GLTFLoader();
let suitcaseModel;
let mixer;
let action;
let wireframeEnabled = false;

loader.load('models/Suitcase.glb', function (gltf) {
  suitcaseModel = gltf.scene;
  suitcaseModel.scale.set(1, 1, 1);

  const box = new THREE.Box3().setFromObject(suitcaseModel);
  const center = box.getCenter(new THREE.Vector3());

  //Model position
  suitcaseModel.position.sub(center);
  suitcaseModel.position.x -= 6;


  scene.add(suitcaseModel);

  //camera settings
  controls.target.set(-6, 0, 0);
  controls.update();
  camera.position.set(0, 2, 5);
  camera.lookAt(-6, 0, 0);

  // Animation
  if (gltf.animations && gltf.animations.length) {
    mixer = new THREE.AnimationMixer(suitcaseModel);
    action = mixer.clipAction(gltf.animations[0]);
    action.clampWhenFinished = true;
    action.loop = THREE.LoopOnce;
  }
}, undefined, function (error) {
  console.error('Error loading suitcase:', error);
});

window.playCloseAnimation = function () {
  if (action) {
    action.paused = false;
    action.timeScale = 1;
    action.reset();
    action.play();
  }
};

window.playOpenAnimation = function () {
  if (action) {
    action.paused = false;
    action.timeScale = -1;
    action.play();
  }
};

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.016);
  controls.update();
  renderer.render(scene, camera);
}
animate();

document.getElementById('toggleWireframe').addEventListener('click', () => {
  if (suitcaseModel) {
    suitcaseModel.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.wireframe = !wireframeEnabled;
      }
    });
    wireframeEnabled = !wireframeEnabled;
  }
});
