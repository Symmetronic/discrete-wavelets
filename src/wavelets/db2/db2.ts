/**
 * Daubechies 2 scaling numbers.
 */
export const Db2Wavelet: number[] = [
  (1 + Math.sqrt(3)) / (4 * Math.SQRT2),
  (3 + Math.sqrt(3)) / (4 * Math.SQRT2),
  (3 - Math.sqrt(3)) / (4 * Math.SQRT2),
  (1 - Math.sqrt(3)) / (4 * Math.SQRT2)
];
