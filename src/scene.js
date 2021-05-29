import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// initialize scene and camera
export const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 20, 30);
camera.lookAt(0, 5, 0);

export const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enablePan = false;
orbit.maxDistance = 60;
orbit.minDistance = 10;

// listeners
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate(delta) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  TWEEN.update(delta);
}
animate();
