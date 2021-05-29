import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createElectrons } from '../util';

const batteryX = -7.8;
const midY = 4.5;
const midX = 7;
let currRayPath = 1;

function createPlumPudding() {
  const group = new THREE.Group();
  const rad = 4;

  const pudding = new THREE.Mesh(
    new THREE.SphereGeometry(rad),
    new THREE.MeshLambertMaterial({
      color: 0xff0000,
      side: THREE.BackSide,
      transparent: true,
    }),
  );
  group.add(pudding);

  const electrons = createElectrons(10, 0.5);
  electrons.forEach((e) => {
    e.position.setFromSphericalCoords(
      Math.random() * (rad - 1) + 1,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );
    group.add(e);
  });

  const t = { time: 0 };
  new TWEEN.Tween(t)
    .to({ time: 1 }, 50)
    .repeat(Infinity)
    .onRepeat(() => {
      electrons.forEach((e) => {
        e.position.add(
          new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5,
          ).setLength(0.1),
        );
        if (e.position.distanceTo(pudding.position) > rad)
          e.position.copy(pudding.position);
      });
    })
    .start();

  return group;
}

function createRayPaths() {
  const highPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(batteryX + 3.8, midY, 0),
    new THREE.Vector3(midX, midY, 0),
    new THREE.Vector3(15, midY + 5, 0),
  ]);

  const midPath = new THREE.LineCurve3(
    new THREE.Vector3(batteryX + 3.8, midY, 0),
    new THREE.Vector3(15, midY, 0),
  );

  const lowPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(batteryX + 3.8, midY, 0),
    new THREE.Vector3(midX, midY, 0),
    new THREE.Vector3(15, midY - 5, 0),
  ]);

  return [highPath, midPath, lowPath];
}

export default function thomson() {
  const group = new THREE.Group();

  new GLTFLoader().load('/assets/thomson.glb', (gltf) => {
    gltf.scene.scale.set(0.2, 0.2, 0.2);
    gltf.scene.position.set(2, 0, -0.2);
    group.add(gltf.scene);
  });

  const points = [
    new THREE.Vector3(batteryX + 6, 6, 0),
    new THREE.Vector3(batteryX + 6, 8, 0),
    new THREE.Vector3(batteryX, 8, 0),
    new THREE.Vector3(batteryX, 2, 0),
    new THREE.Vector3(batteryX, 2, 3),
    new THREE.Vector3(batteryX + 3.8, midY, 3),
    new THREE.Vector3(batteryX + 3.8, midY, 1),
  ];

  group.add(
    new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color: 0xff0000 }),
    ),
  );

  const electrons = createElectrons(4);
  group.add(...electrons);

  const curvePath = new THREE.CurvePath();
  points.forEach((_, i) => {
    if (i > 0) curvePath.add(new THREE.LineCurve3(points[i - 1], points[i]));
  });

  const cathodeRay = createElectrons(16);
  group.add(...cathodeRay);

  const rayPaths = createRayPaths();
  const tween = { time: 0 };
  new TWEEN.Tween(tween)
    .onUpdate(({ time }) => {
      electrons.forEach((e, i) =>
        e.position.copy(curvePath.getPoint((time + i / electrons.length) % 1)),
      );
      cathodeRay.forEach((e, i) =>
        e.position.copy(
          rayPaths[currRayPath].getPoint((time + i / cathodeRay.length) % 1),
        ),
      );
    })
    .onComplete(() => electron.position.copy(points[0]))
    .to({ time: 1 })
    .repeat(Infinity)
    .start();

  const pudding = createPlumPudding();
  pudding.position.setY(15);
  group.add(pudding);

  return group;
}

export function callback() {
  document.getElementById('controls').innerHTML = `
    <div style="padding: 1rem">
      <label for="electric-field">Electric Field</label>
      <input type="checkbox" name="electric-field" id="electric-field" style="margin-right: 0.5rem" />
      <label for="magnetic-field">Magnetic Field</label>
      <input type="checkbox" name="magnetic-field" id="magnetic-field" />
    </div>
  `;

  document.getElementById('electric-field').addEventListener('change', (e) => {
    if (e.currentTarget.checked) currRayPath--;
    else currRayPath++;
  });
  document.getElementById('magnetic-field').addEventListener('change', (e) => {
    if (e.currentTarget.checked) currRayPath++;
    else currRayPath--;
  });
}
