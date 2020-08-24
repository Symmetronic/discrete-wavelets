import { PaddingMode } from "../src/padding/padding";
import {
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

export const haarDatasets: Dataset[] = [
  haarDataset1,
  haarDataset2,
  haarDataset3,
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
];
