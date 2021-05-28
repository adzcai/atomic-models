import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { me, planck, c, createElectrons } from '../util';

export default function bohr() {
  const group = new THREE.Group();

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  );
  nucleus.position.set(0, 6, 0);
  group.add(nucleus);

  const energyLevels = new Array(5).fill().map((_, i) => {
    const n = i + 1;
    const r = ((n * planck) / (me * c * 2 * Math.PI)) * 1e12 * 3;
    const shell = new THREE.Mesh(
      new THREE.SphereGeometry(r, 8, 6, Math.PI, Math.PI, 0, Math.PI),
      new THREE.MeshLambertMaterial({
        color: 0xff00ff,
        side: THREE.DoubleSide,
      }),
    );
    shell.position.set(0, 6, 0);
    group.add(shell);

    const pivot = new THREE.Object3D();
    const electrons = createElectrons(2 * n * n);
    electrons.forEach((e, i) =>
      e.position.setFromCylindricalCoords(
        r,
        (i * (Math.PI * 2)) / (2 * n * n),
        0,
      ),
    );
    pivot.add(...electrons);
    pivot.position.set(0, 6, 0);
    group.add(pivot);
    pivot.userData.speed = 4 / n;
    return pivot;
  });

  const tween = { time: 0 };
  const yAxis = new THREE.Vector3(0, 1, 0);
  new TWEEN.Tween(tween)
    .to({ time: Math.PI * 2 }, 5000)
    .onUpdate(({ time }) => {
      energyLevels.forEach((pivot) => {
        pivot.rotation.set(Math.PI / 2, time * pivot.userData.speed, 0);
        // pivot.setRotationFromAxisAngle(yAxis, time);
      });
    })
    .repeat(Infinity)
    .start();

  return group;
}
