import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import data from './data';
import { createElectrons } from '../util';

export default function rutherford() {
  const group = new THREE.Group();

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(2),
    new THREE.MeshLambertMaterial({ color: '#ff0000' }),
  );
  nucleus.position.set(0, 4, 0);
  group.add(nucleus);

  const electrons = createElectrons(7, 0.5);
  electrons.forEach((e) => {
    group.add(e);
    e.userData.axis = new THREE.Vector3().setFromSphericalCoords(
      1,
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2,
    );
    e.userData.base = new THREE.Vector3()
      .crossVectors(e.userData.axis, new THREE.Vector3(1, 0, 0))
      .applyAxisAngle(e.userData.axis, Math.random() * Math.PI * 2)
      .setLength(Math.random() * 5 + 3);
  });

  const obj = { time: 0 };
  new TWEEN.Tween(obj)
    .to({ time: Math.PI * 2 })
    .onUpdate(({ time }) => {
      electrons.forEach((e) => {
        e.position
          .copy(e.userData.base)
          .applyAxisAngle(e.userData.axis, time)
          .add(new THREE.Vector3(0, 4, 0));
      });
    })
    .repeat(Infinity)
    .start();

  return { group, data: data.rutherford };
}
