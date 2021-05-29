import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import { getR } from '../util';

export default function broglie() {
  const group = new THREE.Group();

  const nucleus = new THREE.Mesh(
    new THREE.SphereGeometry(1),
    new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  );
  nucleus.position.set(0, 4, 0);
  group.add(nucleus);

  // n * wavelen = 2*pi*r
  const nOrbsPerNode = 6;

  const nEnergyLevels = 5;
  const energyLevels = new Array(nEnergyLevels).fill().map((_, i) => {
    const n = i + 1;
    const r = getR(n);
    const nOrbs = n * 2 * nOrbsPerNode;
    return new Array(nOrbs).fill().map((_, j) => {
      const orb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.3, 0.6),
        new THREE.MeshLambertMaterial({
          color: new THREE.Color().setHSL(i / nEnergyLevels, 1, 0.5),
        }),
      );
      orb.position.setFromCylindricalCoords(r, (j * Math.PI * 2) / nOrbs, 4);
      orb.rotation.set(Math.PI / 2, 0, Math.PI / 2 - (j * Math.PI * 2) / nOrbs);
      group.add(orb);
      orb.userData.base = Math.sin((j * Math.PI) / nOrbsPerNode);
      return orb;
    });
  });

  const tween = { time: 0 };
  new TWEEN.Tween(tween)
    .to({ time: Math.PI * 2 }, 750)
    .onUpdate(({ time }) => {
      energyLevels.forEach((orbs, i) => {
        orbs.forEach((orb) => {
          orb.position.setY(4 + orb.userData.base * Math.sin(time));
        });
      });
    })
    .repeat(Infinity)
    .start();

  return group;
}
