import { WaveletBasis } from '../wavelets';

/**
 * Haar wavelet basis.
 */
export const HaarWavelet: WaveletBasis = {

  /**
   * Decomposition filters.
   */
  dec: {

    /* Low-pass filter. */
    low: [
      1 / Math.SQRT2,
      1 / Math.SQRT2,
    ],

    /* High-pass filter. */
    high: [
      1 / Math.SQRT2,
      - 1 / Math.SQRT2,
    ],
  },

  /**
   * Reconstruction filters.
   */
  rec: {

    /* Low-pass filter. */
    low: [
      1 / Math.SQRT2,
      1 / Math.SQRT2,
    ],
    
    /* High-pass filter. */
    high: [
      - 1 / Math.SQRT2,
      1 / Math.SQRT2,
    ],
  },
};
