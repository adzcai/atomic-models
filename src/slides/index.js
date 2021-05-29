import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { scene, camera, orbit } from '../scene';

import dalton, { callback as daltonCallback } from './dalton';
import rutherford from './rutherford';
import thomson, { callback } from './thomson';
import broglie from './broglie';
import bohr from './bohr';
import schroedinger, {
  callback as schroedingerCallback,
  cleanup,
} from './schroedinger';

const SLIDE_W = 50;

let currSlideIndex = 0;

let slideTransition = null;

// create references to dom elements
const fields = {};
['name', 'life', 'discovery_date', 'contribution', 'controls'].forEach(
  (field) => (fields[field] = document.getElementById(field)),
);

// "N/A" model
let textNone = null;
new GLTFLoader().load('/assets/none.glb', (gltf) => {
  gltf.scene.scale.setScalar(0.2);
  textNone = gltf.scene;
});

function initGroup(slide, pos) {
  if (!('group' in slide)) {
    slide.group =
      'createGroup' in slide ? slide.createGroup() : textNone.clone();
    if (pos) slide.group.position.set(pos.x, pos.y, pos.z);
  }

  if (slide.group.parent === null || slide.group.parent.id !== scene.id)
    scene.add(slide.group);

  const { data } = slide;
  fields.name.innerHTML =
    data.name + ('modelName' in data ? '—' + data.modelName : '');
  fields.life.innerHTML = 'Lived ' + data.birth + '–' + data.death;
  fields.discovery_date.innerHTML = 'Discovery made ' + data.discovery_date;
  fields.contribution.innerHTML = data.contribution
    .map((contribution) => `<li>${contribution}</li>`)
    .join('');

  if ('callback' in slide) slide.callback();
}

function transitionSlide(dir) {
  const sign = dir === 'right' ? 1 : -1;
  const currSlide = slides[currSlideIndex];
  const nextSlide = slides[currSlideIndex + sign];

  // when camera comes back to main position, shift world over to next scene
  let { x, y, z } = currSlide.group.position;
  const to = { x: x - sign * SLIDE_W, y, z };

  // cleanup current slide
  if ('cleanup' in currSlide) currSlide.cleanup();
  fields.controls.innerHTML = '';
  // create next group object if not exists
  initGroup(nextSlide, { x: x + sign * SLIDE_W, y, z });

  const tween = { x, y, z };
  slideTransition = new TWEEN.Tween(tween)
    .to(to, 750)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(({ x: x_, y: y_, z: z_ }) => {
      currSlide.group.position.set(x_, y_, z_);
      nextSlide.group.position.set(x_ + sign * SLIDE_W, y_, z_);
    })
    .onComplete(() => {
      if (dir === 'right') currSlideIndex++;
      else currSlideIndex--;
      orbit.enabled = true;
    })
    .start();
}

const origin = new THREE.Vector3(0, 20, 30);

export default function handleKeyPress(ev) {
  if (slideTransition !== null && slideTransition.isPlaying()) return;

  let dir = null;
  if (ev.key === 'ArrowRight' && currSlideIndex < slides.length - 1) {
    dir = 'right';
  } else if (ev.key === 'ArrowLeft' && currSlideIndex > 0) {
    dir = 'left';
  }

  if (dir === null) return;

  orbit.enabled = false;

  if (camera.position.distanceTo(origin) < 0.1) {
    transitionSlide(dir);
  } else {
    const { radius, theta, y } = new THREE.Cylindrical().setFromVector3(
      camera.position,
    );
    const tween = { radius, theta, y };
    const {
      radius: rTo,
      theta: tTo,
      y: yTo,
    } = new THREE.Cylindrical().setFromVector3(origin);

    // spin the camera to the default position
    new TWEEN.Tween(tween)
      .to({ radius: rTo, theta: tTo, y: yTo }, 500)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(({ radius: r_, theta: t_, y: y_ }) => {
        camera.position.setFromCylindricalCoords(r_, t_, y_);
        camera.lookAt(0, 5, 0);
        orbit.update();
      })
      .onComplete(() => {
        transitionSlide(dir);
      })
      .start();
  }
}

const slides = [
  {
    createGroup: dalton,
    data: {
      name: 'John Dalton',
      modelName: 'Billiard Ball Model',
      birth: '6 September 1766',
      death: '27 July 1844',
      discovery_date: '1800–1810',
      contribution: [
        "Coined the term 'atom' from Greek 'atomos', or 'indivisible'",
        'Suggested that each element consists of a unique type of atom that is distinct from other elements, and that atoms combine in whole-number ratios to form compounds',
        'Shown — a water molecule consisting of two hydrogen atoms (green) and an oxygen atom (red)',
      ],
    },
    callback: daltonCallback,
  },
  {
    createGroup: thomson,
    data: {
      name: 'Sir Joseph John Thomson',
      modelName: 'Plum Pudding Model',
      birth: '18 December 1856',
      death: ' 30 August 1940',
      discovery_date: '1897',
      contribution: [
        'Discovered the electron using a cathode ray tube and used deflection from electric and magnetic fields to calculate the charge-to-mass ratio of electrons',
        'Hypothesized the plum pudding model of an atom as a positive field within which negative charges were embedded',
        'Shown: a cathode ray tube as well as his plum pudding model',
        'Red — atom (positive); Blue — electrons (negative)',
      ],
    },
    callback,
  },
  {
    data: {
      name: 'Max Karl Ernst Ludwig Planck',
      birth: '23 April 1858',
      death: '4 October 1947',
      discovery_date: '1900',
      contribution: [
        'In his experimentation with black-body radiation, he postulated that electromagnetic energy could only be emitted in quantized form (i.e. as multiples of an elementary unit, the Planck constant)',
        "This led to Einstein's later hypothesis of light quanta, which was demonstrated by the photoelectric effect",
      ],
    },
  },
  {
    data: {
      name: 'Albert Einstein',
      birth: '14 March 1879',
      death: '18 April 1955',
      discovery_date: '1905',
      contribution: [
        'Hypothesized that photons can act like particles as well as waves, which would explain the photoelectric effect',
        'Demonstrated that mass is another form of energy (E = mc²), which explains the mass defect — that the mass of a stable nucleus is always less than the sum of its parts',
      ],
    },
  },
  {
    data: {
      name: 'Robert Andrews Millikan',
      birth: '22 March 1868',
      death: '19 December 1953',
      discovery_date: '1909',
      contribution: [
        'Used the oil drop experiment to calculate the electric charge of an electron by using an electric field to suspend oil particles midair and calculate for their charge given the downward force',
        "Published results in 1914 confirming the photoelectric effect and Einstein's hypothesis of light quanta",
      ],
    },
  },
  {
    createGroup: rutherford,
    data: {
      name: 'Ernest Rutherford',
      modelName: 'Planetary Model',
      birth: '30 August 1871',
      death: '19 October 1937',
      discovery_date: '1911',
      contribution: [
        'Conducted the gold foil experiment to disprove the raisin bun model',
        'Proved that each atom is mostly empty space with a dense positive nucleus',
        "Shown: Rutherford's 'planetary' model of the atom",
        'Red — nucleus (positive); Blue — electrons (negative)',
      ],
    },
  },
  {
    createGroup: bohr,
    data: {
      name: 'Niels Henrik David Bohr',
      modelName: 'Bohr Model',
      birth: '7 October 1885',
      death: '18 November 1962',
      discovery_date: '1913',
      contribution: [
        'Investigated light produced by various gases to identify elements based on their atomic spectra',
        'Hypothesized that electrons orbited the nucleus at discrete energy levels, and their movement between these levels absorbs/emits light',
        "Shown: Bohr's model of the hydrogen atom",
        'Red — nucleus (positive); Pink — visualization of energy levels; Blue — electrons (negative)',
      ],
      details: 'Advised by Thomson and Rutherford',
    },
  },
  {
    createGroup: broglie,
    data: {
      name: 'Louis de Broglie',
      modelName: 'De Broglie Model',
      birth: '15 August 1892',
      death: '19 March 1987',
      discovery_date: '1924',
      contribution: [
        'Hypothesized that electrons and possibly other matter particles had dual wave and particle properties like photons did',
        'Suggested that electrons are standing waves around the nucleus of an atom',
        "Shown: A 2D visualization of de Broglie's model of the atom",
        'Large red sphere — nucleus (positive), vibrating waves — electrons (negative)',
      ],
    },
  },
  {
    createGroup: schroedinger,
    data: {
      name: 'Erwin Schrödinger',
      modelName: 'Wave Mechanical Model',
      birth: '12 August 1887',
      death: '4 January 1961',
      discovery_date: '1925',
      contribution: [
        'Described each electron as a wave function that describes the probability of finding it at each point in 3D space',
        'Treating particles as probability functions also explains the phenomena of tunneling, where a particle has a low probability of "escaping" from a potential well',
        "Shown: Schrödinger's wave mechanical model of the atom",
        'Blue particles — the larger the sphere, the higher the probability of finding an electron (negative) in that region',
      ],
    },
    callback: schroedingerCallback,
    cleanup,
  },
];

initGroup(slides[currSlideIndex]);
