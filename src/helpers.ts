import {
  Wavelet,
  WaveletBasis,
  Wavelets,
} from "./wavelets/wavelets";

/**
 * Calculates the dot product of two arrays.
 * @param  a First array.
 * @param  b Second array.
 * @return   Dot product.
 */
export function dot(
  a: number[],
  b: number[],
): number {
  /* Check for same length of arrays. */
  if (a.length !== b.length) {
    throw new Error('Both arrays have to have the same length.');
  }

  /* Calculate dot product. */
  return a.reduce((dot, value, index) => dot + value * b[index], 0);
}

/**
 * Determines if a value is a power of two.
 * @param  value Value to check.
 * @return       True if the value is a power of two, otherwise false.
 */
// SOURCE: https://stackoverflow.com/a/600306
export function isPowerOfTwo(value: number): boolean {
  return (value !== 0) && ((value & (value - 1)) === 0);
}

/**
 * Determines a wavelet basis from a wavelet type or basis.
 * @param  wavelet Wavelet type or basis.
 * @return         Wavelet basis.
 */
export function basisFromWavelet(wavelet: Wavelet): WaveletBasis {
  return (typeof wavelet !== 'string') ? wavelet : Wavelets[wavelet]; 
}
