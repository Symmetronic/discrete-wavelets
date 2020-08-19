import { WaveletBasis } from '../wavelets';

/**
 * Daubechies 2 basis.
 * SOURCE: https://dl.acm.org/doi/book/10.5555/130655
 */
export const Db2Wavelet: WaveletBasis = {

  dec: {
    low:  [
      (1 + Math.sqrt(3)) / (4 * Math.SQRT2),
      (3 + Math.sqrt(3)) / (4 * Math.SQRT2),
      (3 - Math.sqrt(3)) / (4 * Math.SQRT2),
      (1 - Math.sqrt(3)) / (4 * Math.SQRT2),
    ],
    high: [
      (1 - Math.sqrt(3)) / (4 * Math.SQRT2),
      - (3 - Math.sqrt(3)) / (4 * Math.SQRT2),
      (3 + Math.sqrt(3)) / (4 * Math.SQRT2),
      - (1 + Math.sqrt(3)) / (4 * Math.SQRT2),
    ],
  },

  rec: {
    low:  [
      (1 + Math.sqrt(3)) / (4 * Math.SQRT2),
      (3 + Math.sqrt(3)) / (4 * Math.SQRT2),
      (3 - Math.sqrt(3)) / (4 * Math.SQRT2),
      (1 - Math.sqrt(3)) / (4 * Math.SQRT2),
    ],
    high: [
      (1 - Math.sqrt(3)) / (4 * Math.SQRT2),
      - (3 - Math.sqrt(3)) / (4 * Math.SQRT2),
      (3 + Math.sqrt(3)) / (4 * Math.SQRT2),
      - (1 + Math.sqrt(3)) / (4 * Math.SQRT2),
    ],
  },
};
