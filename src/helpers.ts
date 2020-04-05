import {
  Filters,
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
 * Asserts if filters are valid or throws an error if the filters are invalid.
 * @param  filters Filters to test.
 * @return         True if filters are valid, otherwise throws an error.
 */
export function assertValidFilters(
  filters: Filters,
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

  return true;
}

/**
 * Asserts if filters are suitable for the coefficients or throws an error if
 * the filters are not suitable.
 * @param  filters Filters to test.
 * @param  coeffs  Coefficients on which the filters are applied.
 * @return         True if filters are valid for coefficients, otherwise throws an error.
 */
export function assertValidFiltersForCoeffs(
  filters: Filters,
  coeffs: number[][],
): boolean {
  /* Check for same length of approximation and detail coefficients on each
   * level.
   */
  let approxLen: number = coeffs[0].length;
  for (let i: number = 1; i < coeffs.length; i++) {
    if (coeffs[i].length !== approxLen) {
      throw new Error(
        'Invalid wavelet basis for coefficients. The wavelet basis does not approximation and detail coefficients of the same length on each level of the transform.'
      );
    }
    approxLen *= filters.low.length;
  }

  return true;
}

/**
 * Asserts if filters are suitable for the data or throws an error if the
 * filters are not suitable.
 * @param  filters Filters to test.
 * @param  data    Data on which the filters are applied.
 * @return         True if filters are valid for data, otherwise throws an error.
 */
export function assertValidFiltersForData(
  filters: Filters,
  data: number[],
): boolean {
  /* Check for minimum data length. */
  if (data.length < filters.low.length) {
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
