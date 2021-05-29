import * as THREE from 'three';

import { scene } from './scene';
import handleKeyPress from './slides';
import './index.css';

// initialize scene
const platform = new THREE.Mesh(
  new THREE.CircleGeometry(10, 12),
  new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide }),
);
platform.rotation.x = Math.PI / 2;
scene.add(platform);

// lighting
const spotlight = new THREE.SpotLight(0xeeeeee);
spotlight.position.set(0, 30, 0);
scene.add(spotlight);
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// make sure we don't get circular dependencies, so put this here
document.addEventListener('keyup', handleKeyPress);
