import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import slides from './slides';
import './index.css';

// global variables and state
const SLIDE_W = 50;
let cameraState = 'standard';
let currSlideIndex = 0;

const fields = {};
['name', 'life', 'discovery_date', 'contribution', 'controls'].forEach(
  (field) => (fields[field] = document.getElementById(field)),
);

function getCurrSlide() {
  return slides[currSlideIndex];
}

function initSlide() {
  const currSlide = getCurrSlide();
  initGroup(currSlide);

  scene.add(currSlide.group);

  const data = getCurrSlide().data;
  fields.name.innerHTML = data.name;
  fields.life.innerHTML = data.birth + '–' + data.death;
  fields.discovery_date.innerHTML = data.discovery_date;
  fields.contribution.innerHTML = data.contribution
    .map((contribution) => `<li>${contribution}</li>`)
    .join('');

  if ('callback' in currSlide) {
    currSlide.callback();
  }
  cameraState = 'standard';
  orbit.enabled = true;
}

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

let textNone = null;
new GLTFLoader().load('/assets/none.glb', (gltf) => {
  gltf.scene.scale.setScalar(0.2);
  textNone = gltf.scene;
});

function initGroup(slide) {
  if (!('group' in slide)) {
    if ('createGroup' in slide) {
      slide.group = slide.createGroup();
    } else {
      slide.group = textNone.clone();
      console.log('CREATE TEXT NONE', slide.group);
    }
  }
}

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

function transitionSlide(dir) {
  // when camera comes back to main position, shift world over to next scene
  let curr = coordsToObject(
    getCurrSlide().group.position,
    'Vector3',
    'Vector3',
  );
  const to = { ...curr };
  let nextSlide;
  if (dir === 'right') {
    to.x -= SLIDE_W;
    nextSlide = slides[currSlideIndex + 1];
  } else {
    to.x += SLIDE_W;
    nextSlide = slides[currSlideIndex - 1];
  }

  if ('cleanup' in getCurrSlide()) getCurrSlide().cleanup();
  fields.controls.innerHTML = '';
  initGroup(nextSlide);

  new TWEEN.Tween(curr)
    .to(to)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(() => {
      nextSlide.group.position.set(
        curr.x + dir === 'right' ? SLIDE_W : -SLIDE_W,
        curr.y,
        curr.z,
      );
      getCurrSlide().group.position.set(curr.x, curr.y, curr.z);
    })
    .onComplete(() => {
      if (dir === 'right') currSlideIndex++;
      else currSlideIndex--;
      initSlide();
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
          new THREE.Vector3().setFromCylindricalCoords(
            ogCamPos.radius,
            ogCamPos.theta,
            ogCamPos.y,
          ),
        ) < 0.1
      ) {
        transitionSlide(cameraState);
      } else {
        const dir = cameraState;
        new TWEEN.Tween(coords)
          .to(ogCamPos)
          .easing(TWEEN.Easing.Quadratic.InOut)
          .onUpdate(() => {
            camera.position.setFromCylindricalCoords(
              coords.radius,
              coords.theta,
              coords.y,
            );
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

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.addEventListener('keyup', (ev) => {
  if (ev.key === 'ArrowRight' && currSlideIndex < slides.length - 1) {
    cameraState = 'right';
  } else if (ev.key === 'ArrowLeft' && currSlideIndex > 0) {
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
