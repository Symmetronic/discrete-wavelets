import {
  PaddingMode,
  PaddingWidths,
} from "./wt";
import {
  antisymmetricPadding,
  constantPadding,
  PADDING_MODES,
  periodicPadding,
  reflectPadding,
  smoothPadding,
  symmetricPadding,
  zeroPadding,
} from "./padding/padding";
import {
  Filters,
  ScalingNumbers,
  Wavelet,
  WaveletBasis,
} from "./wavelets/wavelets";

/**
 * Calculates the element-wise sum of two arrays.
 * @param  a First array.
 * @param  b Second array.
 * @return   Element-wise sum.
 */
export function add(
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

/**
 * Asserts if approximation and detail coefficients are valid or throws an
 * error if they are invalid. 
 * @param  approx Approximation coefficients.
 * @param  detail Detail coefficients.
 * @return        True if the coefficients are valid, otherwise throws an error.
 */
export function assertValidApproxDetail(
  approx: number[],
  detail: number[],
): boolean {
  /* Check if coefficients have equal length. */
  if (approx.length !== detail.length) {
    throw new Error('Approximation and detail coefficients must have equal length.');
  }

  /* Check for coefficients of zero length. */
  if (approx.length === 0) {
    throw new Error('Approximation and detail coefficients must not have zero length.');
  }

  return true;
}

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
 * Asserts if wavelet filters are valid or throws an error if they are invalid.
 * @param  filters Wavelet filters to test.
 * @return         True if the wavelet filters are valid, otherwise throws an error.
 */
export function assertValidFilters(
  filters: Filters,
): boolean {
  /* Check if high-pass and low-pass filters have equal length. */
  if (filters.high.length !== filters.low.length) {
    throw new Error('High-pass and low-pass filters have to have equal length.');
  }

  /* Check if filter length is larger than or equal to two. */
  if (filters.low.length < 2) {
    throw new Error('Wavelet filter length has to be larger than or equal to two.');
  }

  return true;
}

/**
 * Determines a wavelet basis from a wavelet type or basis.
 * @param  wavelet Wavelet type or basis.
 * @return         Wavelet basis.
 */
export function basisFromWavelet(wavelet: Wavelet): WaveletBasis {
  return (typeof wavelet !== 'string')
    ? wavelet
    : waveletFromScalingNumbers(ScalingNumbers[wavelet]); 
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
 * Returns a single padding element.
 * @param  data    Input data.
 * @param  index   Index of padding element.
 * @param  inverse True if the padding direction is inversed.
 * @param  mode    Signal extension mode.
 * @return         Single padding element.
 */
export function padElement(
  data: number[],
  index: number,
  inverse: boolean,
  mode: PaddingMode,
): number {
  switch (mode) {
    case PADDING_MODES.antisymmetric:
      return antisymmetricPadding(data, index, inverse);
    case PADDING_MODES.constant:
      return constantPadding(data, inverse);
    case PADDING_MODES.periodic:
      return periodicPadding(data, index, inverse);
    case PADDING_MODES.reflect:
      return reflectPadding(data, index, inverse);
    case PADDING_MODES.smooth:
      return smoothPadding(data, index, inverse);
    case PADDING_MODES.symmetric:
      return symmetricPadding(data, index, inverse);
    case PADDING_MODES.zero:
      return zeroPadding();
    default:
      throw new Error('Unknown signal extension mode: "' + mode + '"');
  }
}

/**
 * Determines the padding widths.
 * @param  dataLength   Length of signal.
 * @param  filterLength Length of filter.
 * @return              Padding widths.
 */
export function padWidths(
  dataLength: number,
  filterLength: number,
): PaddingWidths {
  /* Check for valid data length. */
  if (dataLength <= 0) {
    throw new Error('Cannot determine padding widths for data of length less than or equal to zero.');
  }

  /* Check for valid filter length. */
  if (filterLength < 2) {
    throw new Error('Cannot determine padding widths for filter of length less than two.');
  }

  /* Determine padding widths. */
  return [
    filterLength - 2,
    ((dataLength + filterLength) % 2 === 0)
      ? filterLength - 2
      : filterLength - 1
  ];
}

/**
 * Determines a wavelet basis from scaling numbers.
 * @param  scalingNumbers Wavelet scaling numbers.
 * @return                Wavelet basis.
 */
export function waveletFromScalingNumbers(
  scalingNumbers: number[],
): WaveletBasis {
  /* Check if length is larger than or equal to two. */
  if (scalingNumbers.length < 2) {
    throw new Error(
      'Scaling numbers length has to be larger than or equal to two.'
    );
  }

  /* Determine wavelet numbers. */
  const waveletNumbers: number[] =
      scalingNumbers.slice() // Copy array
      .reverse()
      .map((value, index) => (index % 2 === 0) ? value : -value);
  
  /* Determine wavelet basis. */
  return {
    dec: {
      low: scalingNumbers.slice(),
      high: waveletNumbers
    },
    rec: {
      low: scalingNumbers.slice(),
      high: waveletNumbers.slice()
    },
  };
}
