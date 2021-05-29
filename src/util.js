import * as THREE from 'three';
import { pi, sqrt, pow, e, cos, sin, i, prod } from 'mathjs';

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
export const reducedPlanck = planck / (2 * pi);
export const me = 9.1093837015e-31; // the electron rest mass in kg
export const c = 299792458; // speed of light in m / s
export const ep0 = 8.8541878128e-12; // permittivity of vacuum in farads per meter
export const a0 = 5.29177210903e-11; // bohr radius in m
export const pR = 0.833e-15; // charge radius of a proton in m

export function getR(n) {
  return ((n * planck) / (me * c * 2 * pi)) * 1e12 * 3;
}

const a032 = pow(a0, 3 / 2);

export const waveFunctions = [
  {
    nlm: [1, 0, 0],
    psi: (r, phi, theta) => (1 / (sqrt(pi) * a032)) * pow(e, -r / a0),
  },
  {
    nlm: [2, 0, 0],
    psi: (r, phi, theta) =>
      (1 / (4 * sqrt(2 * pi) * a032)) * (2 - r / a0) * pow(e, -r / (2 * a0)),
  },
  {
    nlm: [2, 1, 0],
    psi: (r, phi, theta) =>
      (1 / (4 * sqrt(2 * pi) * a032)) *
      (r / a0) *
      pow(e, -r / (2 * a0)) *
      cos(theta),
  },
  {
    nlm: [2, 1, 1],
    psi: (r, phi, theta, m) =>
      prod(
        1 / (8 * sqrt(pi) * a032),
        r / a0,
        pow(e, -r / (2 * a0)),
        sin(theta),
        pow(e, prod(m, i, phi)),
      ),
  },
  {
    nlm: [3, 0, 0],
    psi: (r, phi, theta) =>
      prod(
        1 / (81 * sqrt(3 * pi) * a032),
        [27 - (18 * r) / a0 + (2 * r * r) / (a0 * a0)],
        pow(e, -r / (3 * a0)),
      ),
  },
  {
    nlm: [3, 1, 0],
    psi: (r, phi, theta) =>
      prod(
        sqrt(2),
        1 / (81 * sqrt(pi) * a032),
        6 - r / a0,
        r / a0,
        pow(e, -r / (3 * a0)),
        cos(theta),
      ),
  },
  {
    nlm: [3, 1, 1],
    psi: (r, phi, theta, m) =>
      prod(
        1 / (81 * sqrt(pi) * a032),
        6 - r / a0,
        r / a0,
        pow(e, -r / (3 * a0)),
        sin(theta),
        pow(e, prod(m, i, phi)),
      ),
  },
  {
    nlm: [3, 2, 0],
    psi: (r, phi, theta) =>
      prod(
        1 / (81 * sqrt(6 * pi) * a032),
        (r * r) / (a0 * a0),
        pow(e, -r / (3 * a0)),
        3 * cos(theta) * cos(theta) - 1,
      ),
  },
  {
    nlm: [3, 2, 1],
    psi: (r, phi, theta, m) =>
      prod(
        1 / (81 * sqrt(pi) * a032),
        (r * r) / (a0 * a0),
        pow(e, -r / (3 * a0)),
        sin(theta),
        cos(theta),
        pow(e, prod(m, i, phi)),
      ),
  },
  {
    nlm: [3, 2, 2],
    psi: (r, phi, theta, m) =>
      prod(
        1 / (162 * sqrt(pi) * a032),
        (r * r) / (a0 * a0),
        pow(e, -r / (3 * a0)),
        sin(theta) * sin(theta),
        pow(e, prod(m, i, 2, phi)),
      ),
  },
];
