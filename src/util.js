import * as THREE from 'three';

export function createElectrons(n, size = 0.1) {
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
