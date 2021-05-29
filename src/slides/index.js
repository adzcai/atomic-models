import dalton from './dalton';
import rutherford from './rutherford';
import thomson, { callback } from './thomson';
import broglie from './broglie';
import bohr from './bohr';
import schroedinger, {
  callback as schroedingerCallback,
  cleanup,
} from './schroedinger';

export default [
  {
    createGroup: dalton,
    data: {
      name: 'John Dalton',
      birth: '6 September 1766',
      death: '27 July 1844',
      discovery_date: '1800–1810',
      contribution: [
        "Coined the term 'atom' from Greek 'atomos', or 'indivisible'",
        'Suggested that each element consists of a unique type of atom that is distinct from other elements, and that atoms combine in whole-number ratios to form compounds',
        'Shown — a water molecule consisting of two hydrogen atoms (green) and an oxygen atom (red)',
      ],
    },
  },
  {
    createGroup: thomson,
    data: {
      name: 'Sir Joseph John Thomson',
      birth: '18 December 1856',
      death: ' 30 August 1940',
      discovery_date: '1897',
      contribution: [
        'Discovered the electron using a cathode ray tube and used deflection from electric and magnetic fields to calculate the charge-to-mass ratio of electrons',
        'Hypothesized the plum pudding model of an atom as a positive field within which negative charges were embedded',
        'Shown: a cathode ray tube as well as his plum pudding model',
        'Red — atom; Blue — electrons',
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
      birth: '30 August 1871',
      death: '19 October 1937',
      discovery_date: '1911',
      contribution: [
        'Conducted the gold foil experiment to disprove the raisin bun model',
        'Proved that each atom is mostly empty space with a dense positive nucleus',
        "Shown: Rutherford's 'planetary' model of the atom",
        'Red — positive nucleus; Blue — electrons',
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
        "Shown: Bohr's model of the hydrogen atom",
        'Red — nucleus; Pink — energy levels; Blue — electrons',
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
      discovery_date: '1924',
      contribution: [
        'Hypothesized that electrons and possibly other matter particles had dual wave and particle properties like photons did',
        'Suggested that electrons are standing waves around the nucleus of an atom',
        "Shown: A 2D visualization of de Broglie's model of the atom",
        'Large red sphere — nucleus, vibrating waves — electrons',
      ],
    },
  },
  {
    createGroup: schroedinger,
    data: {
      name: 'Erwin Schrödinger',
      birth: '12 August 1887',
      death: '4 January 1961',
      discovery_date: '1925',
      contribution: [
        'Described each electron as a wave function that describes the probability of finding it at each point in 3D space',
        'Treating particles as probability functions also explains the phenomena of tunneling, where a particle has a low probability of "escaping" from a potential well',
        "Shown: Schrödinger's wave mechanical model of the atom",
        'Blue particles — the larger the sphere, the higher the probability of finding an electron in that region',
      ],
    },
    callback: schroedingerCallback,
    cleanup,
  },
];
