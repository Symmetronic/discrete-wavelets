import { WaveletBasis } from '../wavelets';

/**
 * Haar wavelet basis.
 */
export const HaarWavelet: WaveletBasis = {

  dec: {
    low:  [1 / Math.SQRT2,  1 / Math.SQRT2],
    high: [1 / Math.SQRT2, -1 / Math.SQRT2],
  },

  rec: {
    low:  [1 / Math.SQRT2,  1 / Math.SQRT2],
    high: [-1 / Math.SQRT2, 1 / Math.SQRT2],
  },
};
