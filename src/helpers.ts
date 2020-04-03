import {
  Filters,
  Wavelet,
  WaveletBasis,
  Wavelets,
} from "./wavelets/wavelets";

/**
 * Asserts if data is valid or throws an error if the data is invalid.
 * @param  data Data to test.
 * @return      True if data is valid, otherwise throws an error.
 */
export function assertValidData(data: number[]): boolean {
  /* Check if length is a power of two. */
  if (!isPowerOfTwo(data.length)) {
    throw new Error(
      'Input data has to have a length of a power of 2, but length is ' + data.length
    );
  }

  return true;
}

/**
 * Asserts if filters are valid or throws an error if the filters are invalid
 * or not suitable for the data.
 * @param  filters Filters to test.
 * @param  dataLen Length of the data on which the filters are applied.
 * @return         True if filters are valid, otherwise throws an error.
 */
export function assertValidFilters(
  filters: Filters,
  dataLen: number,
): boolean {
  /* Check for equal length of high-pass and low-pass filters. */
  if (filters.low.length !== filters.high.length) {
    throw new Error(
      'Invalid filters: Low-pass and high-pass filters have different lengths.'
    );
  }

  /* Check for even filter length. */
  if (filters.low.length % 2 !== 0) {
    throw new Error(
      'Invalid filters: They have to have even length.'
    );
  }

  /* Check for minimum data length. */
  if (dataLen < filters.low.length) {
    throw new Error(
      'In order to use this wavelet basis, input data has to have a length larger than or equal to ' + filters.low.length
    );
  }

  return true;
}

/**
 * Determines a wavelet basis from a wavelet type or basis.
 * @param  wavelet Wavelet type or basis.
 * @return         Wavelet basis.
 */
export function basisFromWavelet(wavelet: Wavelet): WaveletBasis {
  return (typeof wavelet !== 'string') ? wavelet : Wavelets[wavelet]; 
}

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
