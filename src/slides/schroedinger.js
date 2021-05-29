import * as THREE from 'three';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { abs, log, pi, prod } from 'mathjs';
import { a0, waveFunctions } from '../util';

const params = {
  n: 1,
  l: 0,
  m: 0,
  scale: 2,
  zoom: 2,
};

const state = {
  group: new THREE.Group(),
};

const origin = new THREE.Vector3(0, 4, 0);

let gui = null;

function createGui() {
  gui = new GUI();
  gui.add(params, 'n', 1, 3, 1).onFinishChange(handleChange);
  gui.add(params, 'l', 0, 2, 1).onFinishChange(handleChange);
  gui.add(params, 'm', -2, 2, 1).onFinishChange(handleChange);
  gui.add(params, 'scale', 1, 10, 0.5).onChange(handleChange);
  gui.add(params, 'zoom', 1.25, 15, 0.25).onChange(handleChange);
}

function handleChange() {
  const waveFunction = waveFunctions.find(
    ({ nlm: [n_, l_, m_] }) =>
      params.n === n_ && params.l === l_ && abs(params.m) === m_,
  );

  if (waveFunction) {
    state.group.children.forEach((ball) => {
      const {
        radius: r_,
        phi,
        theta,
      } = new THREE.Spherical().setFromVector3(
        ball.position.clone().sub(origin),
      );
      const r = r_ * a0 * log(params.zoom); // the "real" radius at atomic level

      const psi = waveFunction.psi(r, phi, theta, params.m);
      const factor = 4 * pi * r * r * a0 * params.scale;
      // are you supposed to take absolute value? sometimes there's complex results
      ball.scale.setScalar(abs(prod(psi, psi, factor)));
    });
  } else {
    alert('Remember l < n and |m| <= l');
    params.l = params.m = 0;
  }
}

export default function schroedinger() {
  for (let r = 1; r < 10; r += 0.5) {
    for (let phi = 0; phi < pi; phi += pi / 8) {
      for (let theta = 0; theta < pi * 2; theta += pi / 8) {
        const ball = new THREE.Mesh(
          new THREE.SphereGeometry(0.2),
          new THREE.MeshLambertMaterial({ color: 0x00ffff }),
        );
        ball.position.setFromSphericalCoords(r, phi, theta).add(origin);
        state.group.add(ball);
      }
    }
  }

  handleChange();

  return state.group;
}

export function callback() {
  if (gui === null) createGui();
  else gui.open();
}

export function cleanup() {
  gui.close();
}
