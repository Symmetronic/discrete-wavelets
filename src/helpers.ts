import {
  Wavelet,
  WaveletBasis,
  Wavelets,
} from "./wavelets/wavelets";

/**
 * Asserts if coefficients are valid or throws an error if they are invalid.
 * @param  coeffs Coefficients to test.
 * @return        True if the coefficients are valid, otherwise throws an error.
 */
export function assertValidCoeffs(
  coeffs: number[][],
): boolean {
  /* Check if at least an array of approximation coefficients is given. */
  if (coeffs.length < 1) {
    throw new Error(
      'Invalid coefficients. Array length must not be zero.'
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
 * Creates an array and populates it.
 * @param  length   Length of the array.
 * @param  populate Function to populate the array.
 * @return          Populated array with specified length.
 */
export function createArray(
  length: number,
  populate: number | ((index: number) => number) = 0,
): number[] {
  /* Check for non-integer length. */
  if (!Number.isInteger(length)) {
    throw new Error('Length has to be an integer.');
  }

  /* Check for length less than zero. */
  if (length < 0) {
    throw new Error('Length must not be smaller than zero.')
  }

  /* Create and populate array. */
  return Array.apply(null, Array(length)).map((_, index) =>
    (typeof populate === 'function')
      ? populate(index)
      : populate
  );
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

/**
 * Multiplies an array with a scalar value.
 * @param  scalar Scalar value.
 * @param  array  Array of numbers.
 * @return        Array multiplied with scalar value.
 */
export function mulScalar(
  scalar: number,
  array: number[],
): number[] {
  return array.map(value => scalar * value);
}

/**
 * Multiplies an array with an array of scalar values.
 * @param  scalars Array of scalar values.
 * @param  array   Array of numbers.
 * @return         Flat array of numbers of subsequent multiplications of scalars with the array of numbers.
 */
export function mulScalars(
  scalars: number[],
  array: number[],
): number[] {
  let values: number[] = [];
  for (const scalar of scalars) {
    values = values.concat(mulScalar(scalar, array));
  }
  return values;
}

/**
 * Calculates the element-wise sum of two arrays.
 * @param  a First array.
 * @param  b Second array.
 * @return   Element-wise sum.
 */
export function sum(
  a: number[],
  b: number[],
): number[] {
  /* Check for same length of arrays. */
  if (a.length !== b.length) {
    throw new Error('Both arrays have to have the same length.');
  }

  /* Calculate element-wise sum. */
  return a.map((value, index) => value + b[index]);
}
