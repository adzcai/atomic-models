import dalton from './dalton';
import millikan from './millikan';
import rutherford from './rutherford';
import thompson, { callback, cleanup } from './thompson';
import broglie from './broglie';
import bohr from './bohr';

export default [
  {
    createGroup: dalton,
    data: {
      name: 'John Dalton',
      birth: '6 September 1766',
      death: '27 July 1844',
      discovery_date: '1808',
      contribution: [
        "Coined the term 'atom' from Greek 'atomos', or 'indivisible'",
        'Suggested that each element consists of a unique type of atom that is distinct from other elements, and that atoms combine in whole-number ratios to form compounds',
      ],
    },
  },
  {
    createGroup: thompson,
    data: {
      name: 'Sir Joseph John Thompson',
      birth: '18 December 1856',
      death: ' 30 August 1940',
      discovery_date: '1897',
      contribution: [
        'Discovered the electron using a cathode ray tube',
        'Used deflection from electric and magnetic fields to calculate the charge-to-mass ratio of electrons',
      ],
    },
    callback,
    cleanup,
  },
  {
    createGroup: millikan,
    data: {
      name: 'Robert Andrews Millikan',
      birth: '22 March 1868',
      death: '19 December 1953',
      discovery_date: '1909',
      contribution: [
        'Used the oil drop experiment to calculate the electric charge of an electron',
        'Used an electric field to suspend oil particles midair and calculate for their charge given the downward force',
      ],
    },
  },
  {
    createGroup: rutherford,
    data: {
      name: 'Ernest Rutherford',
      birth: '30 August 1871',
      death: '19 October 1937',
      discovery_date: '1911',
      contribution: [
        'Conducted the gold foil experiment to disprove the raisin bun model',
        'Proved that each atom is mostly empty space with a dense positive nucleus',
      ],
    },
  },
  {
    createGroup: bohr,
    data: {
      name: 'Niels Henrik David Bohr',
      birth: '7 October 1885',
      death: '18 November 1962',
      discovery_date: '1913',
      contribution: [
        'Investigated light produced by various gases to identify elements based on their atomic spectra',
        'Hypothesized that electrons orbited the nucleus at discrete energy levels, and their movement between these levels absorbs/emits light',
      ],
      details: 'Advised by Thomson and Rutherford',
    },
  },
  {
    createGroup: broglie,
    data: {
      name: 'Louis de Broglie',
      birth: '15 August 1892',
      death: '19 March 1987',
      discovery_date: '191341532',
      contribution: [
        'Hypothesized that electrons also had dual wave and particle properties',
        'Suggested that electrons are standing waves around the nucleus of an atom',
      ],
    },
  },
  {
    data: {
      name: 'Ernest Schrödinger',
      birth: '',
      death: '',
      discovery_date: '',
      contribution: '',
    },
  },
  {
    data: {
      name: 'Albert Einstein',
      birth: '',
      death: '',
      discovery_date: '',
      contribution: '',
    },
  },
  {
    data: {
      name: 'Max Planck',
      birth: '',
      death: '',
      discovery_date: '',
      contribution: '',
    },
  },
];
