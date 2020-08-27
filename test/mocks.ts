import { PaddingMode } from "../src/padding/padding";
import {
  Db2Wavelet,
  HaarWavelet,
  WaveletBasis,
  WaveletType,
} from "../src/wavelets/wavelets";

/**
 * Dataset for checking the correctness of the wavelet transform.
 */
export interface Dataset {

  /**
   * Input data values.
   */
  data: number[];

  /**
   * Single level DWT coefficients.
   */
  dwt: number[][];

  /**
   * Energy of data.
   */
  energy: number;

  /**
   * Signal extension mode.
   */
  mode: PaddingMode;

  /**
   * Wavelet decomposition coefficients.
   */
  wavedec: number[][];
}

/*
 * Datasets for Haar transform.
 */
const haarDataset1: Dataset = {
  data: [Math.SQRT2],
  dwt: [[2], [0]],
  energy: 2,
  mode: 'constant',
  wavedec: [[Math.SQRT2]],
};

const haarDataset2: Dataset = {
  data: [1, 2, 3, 4],
  dwt: [
    [3 / Math.SQRT2, 7 / Math.SQRT2],
    [-1 / Math.SQRT2, -1 / Math.SQRT2]
  ],
  energy: 30,
  mode: 'zero',
  wavedec: [
    [5],
    [-2],
    [-1 / Math.SQRT2, -1 / Math.SQRT2]
  ],
};

const haarDataset3: Dataset = {
  data: [0, 1, 2, 3, 5],
  dwt: [
    [1 / Math.SQRT2, 5 / Math.SQRT2, 5 / Math.SQRT2],
    [-1 / Math.SQRT2, - 1 / Math.SQRT2, 5 / Math.SQRT2]
  ],
  energy: 39,
  mode: 'zero',
  wavedec: [
    [3, 2.5],
    [-2, 2.5],
    [
      -1 / Math.SQRT2, -1 / Math.SQRT2, 5 / Math.SQRT2
    ]
  ],
};

const haarDataset4: Dataset = {
  data: [3, 7, 1, 1, -2, 5, 4, 6],
  dwt: [
    [ 7.07106781, 1.41421356, 2.12132034, 7.07106781],
    [-2.82842712, 0, -4.94974747, -1.41421356]
  ],
  energy: 141,
  mode: 'symmetric',
  wavedec: [
    [8.83883476],
    [-0.35355339],
    [4., -3.5],
    [-2.82842712, 0, -4.94974747, -1.41421356]
  ],
};

export const haarDatasets: Dataset[] = [
  haarDataset1,
  haarDataset2,
  haarDataset3,
  haarDataset4,
];

/*
 * Datasets for Daubechies 2 transform.
 */
const db2Dataset1: Dataset = {
  data: [Math.SQRT2],
  dwt: [
    [0.3169873, 0.6830127],
    [1.1830127, -0.1830127]
  ],
  energy: 2,
  mode: 'zero',
  wavedec: [[Math.SQRT2]],
};

const db2Dataset2: Dataset = {
  data: [3, 7, 1, 1, -2, 5, 4, 6],
  dwt: [
    [5.65685425, 7.39923721, 0.22414387, 3.33677403, 7.77817459],
    [-2.44948974, -1.60368225, -4.44140056, -0.41361256, 1.22474487]
  ],
  energy: 141,
  mode: 'symmetric',
  wavedec: [
    [5.65685425, 7.39923721, 0.22414387, 3.33677403, 7.77817459],
    [-2.44948974, -1.60368225, -4.44140056, -0.41361256, 1.22474487]
  ],
};

export const db2Datasets: Dataset[] = [
  db2Dataset1,
  db2Dataset2,
];

/*
 * Mapping of wavelet aliases, datasets and wavelets.
 */
export const waveletDatasets: {
  aliases: WaveletType[],
  datasets: Dataset[],
  wavelet: WaveletBasis,
}[] = [
  {
    aliases: ['db1', 'D2', 'haar'],
    datasets: haarDatasets,
    wavelet: HaarWavelet,
  },
  {
    aliases: ['db2', 'D4'],
    datasets: db2Datasets,
    wavelet: Db2Wavelet,
  }
];
