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
   * Coefficients.
   */
  coeffs: number[][];

  /**
   * Input data values.
   */
  data: number[];

  /**
   * Energy of data.
   */
  energy: number;
}

/*
 * Datasets for Haar transform.
 */
const dataset1: Dataset = {
  data: [1, 2, 3, 4],
  coeffs: [[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]],
  energy: 30,
};

const dataset2: Dataset = {
  data: [0, 1, 2, 3, 5, 8, 13, 21],
  coeffs: [
    [18.73832970144351],
    [-14.495689014324228],
    [-2.0000000000000004, -10.500000000000004],
    [
      -0.7071067811865476, -0.7071067811865477,
      -2.121320343559643, -5.65685424949238
    ]
  ],
  energy: 713,
}

export const haarDatasets: Dataset[] = [
  dataset1,
  dataset2,
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
