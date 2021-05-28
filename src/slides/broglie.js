import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

import { planck, me, c } from '../util';

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

  const energyLevels = new Array(5).fill().map((_, i) => {
    const n = i + 1;
    const r = ((n * planck) / (me * c * 2 * Math.PI)) * 1e12 * 3;

    const nOrbs = n * 2 * nOrbsPerNode;
    return new Array(nOrbs).fill().map((_, j) => {
      const orb = new THREE.Mesh(
        new THREE.BoxGeometry(0.8),
        new THREE.MeshLambertMaterial({ color: 0xff0000 }),
      );
      orb.position.setFromCylindricalCoords(r, (j * Math.PI * 2) / nOrbs, 4);
      orb.rotateY((j * Math.PI * 2) / nOrbs);
      group.add(orb);
      orb.userData.base = Math.sin((j * Math.PI) / nOrbsPerNode);
      return orb;
    });
  });

  const tween = { time: 0 };
  new TWEEN.Tween(tween)
    .to({ time: Math.PI * 2 }, 750)
    .onUpdate(({ time }) => {
      energyLevels.forEach((orbs) => {
        orbs.forEach((orb) => {
          orb.scale.setY(1 + orb.userData.base * Math.sin(time));
          orb.material.color.setHSL(
            0,
            1,
            0.5 + (orb.userData.base * Math.sin(time)) / 2,
          );
        });
      });
    })
    .repeat(Infinity)
    .start();

  return group;
}
