import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as TWEEN from '@tweenjs/tween.js';

import { dalton, thompson, rutherford, millikan } from './slides';
import './index.css';

const GRAVITY = 9.81; // N / kg

const data = [rutherford(), thompson(), dalton()];
let currSlideIndex = 0;
function getCurrSlide() {
  return data[currSlideIndex];
}

function initSlide() {
  scene.add(getCurrSlide().group);
  updateData();
  if ('callback' in getCurrSlide()) {
    getCurrSlide().callback();
  }
  cameraState = 'standard';
  orbit.enabled = true;
}

const SLIDE_W = 50;

let cameraState = 'standard';

// initialize scene and camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// orbit.update() must be called after any manual changes to the camera's transform
const ogCamPos = { radius: 30, theta: 0, y: 20 };
camera.position.setFromCylindricalCoords(
  ogCamPos.radius,
  ogCamPos.theta,
  ogCamPos.y,
);
camera.lookAt(0, 5, 0);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enablePan = false;
orbit.maxDistance = 50;
orbit.minDistance = 10;
// orbit.autoRotate = true;

function coordsToObject(coords, from, to) {
  let x, y, z, radius, y_, theta;

  if (from === 'Vector3') {
    ({ x, y, z } = coords);
    ({ radius, y: y_, theta } = new THREE.Cylindrical().setFromVector3(coords));
  } else if (from === 'Cylindrical') {
    ({ radius, y: y_, theta } = coords);
    ({ x, y, z } = new THREE.Vector3().setFromCylindrical(coords));
  }

  if (to === 'Vector3') {
    return { x, y, z };
  } else if (to === 'Cylindrical') {
    return { radius, y: y_, theta };
  }
}

function listify(coords) {
  if ('x' in coords) return [coords.x, coords.y, coords.z];
  else return [coords.radius, coords.theta, coords.y];
}

function transitionSlide(dir) {
  // when camera comes back to main position, shift world over to next scene
  let curr = coordsToObject(
    getCurrSlide().group.position,
    'Vector3',
    'Vector3',
  );
  const to = { ...curr };
  if (dir === 'right') to.x -= SLIDE_W;
  else to.x += SLIDE_W;

  new TWEEN.Tween(curr)
    .to(to)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      if (dir === 'right' && currSlideIndex < data.length - 1) {
        data[currSlideIndex + 1].group.position.set(
          curr.x + SLIDE_W,
          curr.y,
          curr.z,
        );
      } else if (currSlideIndex > 0) {
        data[currSlideIndex - 1].group.position.set(
          curr.x - SLIDE_W,
          curr.y,
          curr.z,
        );
      }
      getCurrSlide().group.position.set(curr.x, curr.y, curr.z);
    })
    .onComplete(() => {
      if (dir === 'right') currSlideIndex++;
      else currSlideIndex--;
      scene.add(getCurrSlide().group);
      updateData();
      if ('callback' in data[currSlideIndex]) {
        data[currSlideIndex].callback();
      }
      cameraState = 'standard';
      orbit.enabled = true;
    })
    .start();
}

function updatePhysics(delta) {
  switch (cameraState) {
    case 'right':
    case 'left':
      orbit.enabled = false;
      // controls.autoRotate = false;
      const coords = coordsToObject(camera.position, 'Vector3', 'Cylindrical');

      if (
        camera.position.distanceTo(
          new THREE.Vector3().setFromCylindricalCoords(...listify(ogCamPos)),
        ) < 0.1
      ) {
        transitionSlide(cameraState);
      } else {
        const dir = cameraState;
        new TWEEN.Tween(coords)
          .to(ogCamPos)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            camera.position.setFromCylindricalCoords(...listify(coords));
            camera.lookAt(0, 5, 0);
          })
          .onComplete(() => {
            transitionSlide(dir);
          })
          .start();
      }
      cameraState = 'resetting';
      break;
    case 'resetting':
      break;
    default:
      orbit.update();
  }
}

const platform = new THREE.Mesh(
  new THREE.CircleGeometry(10),
  new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }),
);
platform.rotation.x = Math.PI / 2;
scene.add(platform);

const spotlight = new THREE.SpotLight(0xffffff);
spotlight.position.set(0, 20, 0);
scene.add(spotlight);

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

function updateData() {
  const data = getCurrSlide().data;
  document.getElementById('name').innerHTML = data.name;
  document.getElementById('life').innerHTML = data.birth + '–' + data.death;
  document.getElementById('discovery_date').innerHTML = data.discovery_date;
  document.getElementById('contribution').innerHTML = data.contribution
    .map((contribution) => `<li>${contribution}</li>`)
    .join('');
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('keyup', (ev) => {
  if (ev.key === 'ArrowRight') {
    cameraState = 'right';
  } else if (ev.key === 'ArrowLeft') {
    cameraState = 'left';
  }
});

function animate(delta) {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  updatePhysics(delta);
  TWEEN.update(delta);
}
initSlide();
animate();
