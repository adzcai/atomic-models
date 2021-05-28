import * as THREE from 'three';

export function createElectrons(n, size = 0.2) {
  return new Array(n)
    .fill()
    .map(
      () =>
        new THREE.Mesh(
          new THREE.SphereGeometry(size),
          new THREE.MeshLambertMaterial({ color: 0x00ffff }),
        ),
    );
}

export const planck = 6.62607015e-34; // J / Hz
export const me = 9.1093837015e-31; // kg
export const c = 299792458; // m / s
