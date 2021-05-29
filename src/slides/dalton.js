import * as THREE from 'three';

export default function dalton() {
  const group = new THREE.Group();

  const ballRadius = 3;
  const hydrogen = new THREE.Mesh(
    new THREE.SphereGeometry(ballRadius),
    new THREE.MeshLambertMaterial({ color: 0x00ff00 }),
  );
  hydrogen.position.set(5, ballRadius + 5, 0);
  group.add(hydrogen);

  const hydrogen2 = hydrogen.clone(true);
  hydrogen2.position.set(-5, ballRadius + 5, 0);
  group.add(hydrogen2);

  const oxygenRadius = 6;
  const oxygen = new THREE.Mesh(
    new THREE.SphereGeometry(oxygenRadius),
    new THREE.MeshLambertMaterial({ color: 0xff0000 }),
  );
  oxygen.position.set(0, oxygenRadius, 0);
  group.add(oxygen);

  return group;
}

export function callback() {
  document.getElementById('controls').innerHTML = `
    <p style="padding: 1rem">
      Use the arrow keys to move and your mouse / drag to look around!
      <br />
      Please view on a laptop for best results.
    </p>
  `;
}
