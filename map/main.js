// Import the necessary components from the Three.js library
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Set background to white

const container = document.getElementById("container3D");

// Create a camera and position it for a more zoomed-out isometric view
const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(24, 22, 24);
camera.lookAt(new THREE.Vector3(0, 0, 0)); // Look at the center of the model

// Create a WebGL renderer and set its size
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Add OrbitControls to allow free rotation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // Optional: Adds smoothness to controls
controls.dampingFactor = 0.05; // Optional: Adjust damping factor
controls.target.set(0, 0, 0); // Center the controls on the target point

// Add lights to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

const cubes = {}; // Store references to cubes

function fitCameraToObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxSize = Math.max(size.x, size.y, size.z);
  const fitDistance = maxSize / (2 * Math.tan((camera.fov * Math.PI) / 360));

  object.position.sub(center);
  camera.position.set(fitDistance * 0.85, fitDistance * 0.65, fitDistance * 0.85);
  camera.near = Math.max(fitDistance / 100, 0.1);
  camera.far = fitDistance * 10;
  camera.updateProjectionMatrix();

  controls.target.set(0, 0, 0);
  controls.update();
}

function resizeRenderer() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Load the GLB model
const loader = new GLTFLoader();
loader.load(
  'storemap.glb', // Path to the .glb model
  function (gltf) {
    // Scale the model
    gltf.scene.scale.set(4, 4, 4); // Adjust scale to fit the model within the view

    // Add the loaded model to the scene
    scene.add(gltf.scene);
    fitCameraToObject(gltf.scene);

    // Store references to cubes
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        console.log(`Mesh Name: ${child.name}`);
        // Store cube references by name
        if (child.name.startsWith('Cube')) {
          cubes[child.name] = child;
        }
      }
    });
  },
  undefined,
  function (error) {
    console.error('An error occurred loading the model:', error);
  }
);

// Function to handle search query
function searchProduct() {
  // Get the user input from the text input and dropdown
  const textInput = document.getElementById("product-search").value.trim().toLowerCase();
  const dropdownInput = document.getElementById("category-dropdown").value.trim().toLowerCase();

  // Determine the query from either text input or dropdown
  const query = textInput || dropdownInput;

  // Define the mapping between search queries and cubes
  const queryToCubeMap = {
    'games': 'Cube001',
    'beauty': 'Cube002',
    'medical': 'Cube003',
    'sports': 'Cube004',
    'grocery': 'Cube005',
    'furniture': 'Cube006',
    'electronics': 'Cube007',
    'hardware': 'Cube008',
    'stationery': 'Cube009',
  };

  // Reset all cubes to their original color (if needed)
  Object.values(cubes).forEach(cube => {
    if (cube.material) {
      cube.material = cube.material.clone(); // Clone to ensure a new material instance
      cube.material.color.set(0x999999); // Light gray color (default)
    }
  });

  // Change the color of the specific cube based on the query
  const cubeName = queryToCubeMap[query];
  if (cubeName && cubes[cubeName]) {
    cubes[cubeName].material = cubes[cubeName].material.clone(); // Clone to ensure a new material instance
    cubes[cubeName].material.color.set(0x4dff4d); // Green color
    console.log(`${cubeName} color changed to green`);
  } else {
    console.log('No matching cube for query:', query);
  }
}

// Render the scene and camera
function animate() {
  requestAnimationFrame(animate);

  // Update controls to enable rotation
  controls.update();

  renderer.render(scene, camera);
}
animate();

// Adjust the scene on window resize
window.addEventListener('resize', resizeRenderer);

// Export the searchProduct function to be accessible globally
window.searchProduct = searchProduct;
