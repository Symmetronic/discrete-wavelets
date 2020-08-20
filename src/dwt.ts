export {
  Filters,
  Wavelet,
  WaveletBasis,
  WaveletType,
} from './wavelets/wavelets';

import {
  assertValidCoeffs,
  assertValidData,
  assertValidFilters,
  assertValidFiltersForCoeffs,
  assertValidFiltersForData,
  basisFromWavelet,
  dot,
  mulScalars,
  sum,
} from './helpers';

import {
  Filters,
  Wavelet,
  WaveletBasis,
} from "./wavelets/wavelets";

/**
 * Default wavelet to use.
 */
const DEFAULT_WAVELET: Wavelet = 'haar';

/**
 * Collection of methods for Discrete Wavelet Transform (DWT).
 */
export default class dwt {

  /**
   * Single level discrete wavelet transform.
   * @param  data    Input data with a length equal to a power of two.
   * @param  wavelet Wavelet to use.
   * @return         Approximation and detail coefficients as result of the transform.
   */
  static dwt(
    data: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[][] {
    // TODO: Implement signal extension modes and remove assertion. 
    /* Check if data is valid. */
    assertValidData(data);

    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);
    
    /* Use decomposition filters. */
    const filters: Filters = waveletBasis.dec;

    /* Check if filters are valid. */
    assertValidFilters(filters);

    // TODO: Implement signal extension modes and remove/adjust assertion.
    /* Check if filters are valid for data. */
    assertValidFiltersForData(filters, data);

    /* Initialize approximation and detail coefficients. */
    let approx: number[] = [];
    let detail: number[] = [];

    /* Calculate coefficients. */
    for (let offset: number = 0; offset < data.length; offset += 2) {
      /* Determine slice of values. */
      const end: number = offset + filters.low.length;
      const wrappedEnd: number = end - data.length;
      const values: number[] = (wrappedEnd < 0)
          /* Slice values. */
          ? data.slice(offset, end)
          /* Slice values to end and add additional values from start. */
          : data.slice(offset).concat(data.slice(0, wrappedEnd));

      /* Calculate approximation coefficients. */
      approx.push(
        dot(values, filters.low)
      );

      /* Calculate detail coefficients. */
      detail.push(
        dot(values, filters.high)
      );
    }

    /* Return approximation and detail coefficients. */
    return [approx, detail];
  }

  /**
   * Calculates the energy as sum of squares of an array of data or
   * coefficients.
   * @param  values Array of data or coefficients.
   * @return        Energy of values as the sum of squares.
   */
  static energy(values: number[] | number[][]): number {
    let energy: number = 0;
    for (const value of values) {
      if (!Array.isArray(value)) energy += Math.pow(value, 2);
      else energy += this.energy(value);
    }
    return energy;
  }

  /**
   * Single level inverse discrete wavelet transform.
   * @param  approx  Approximation coefficients.
   * @param  detail  Detail coefficients.
   * @param  wavelet Wavelet to use.
   * @return         Approximation coefficients of previous level of transform.
   */
  static idwt(
    approx: number[],
    detail: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[] {
    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);

    /* Use reconstruction filters. */
    const filters: Filters = waveletBasis.rec;

    /* Check if filters are valid. */
    assertValidFilters(filters);

    /* Check if filters are valid for coeffs. */
    assertValidFiltersForCoeffs(filters, [approx, detail]);

    /* Calculate previous level of approximation. */
    return sum(
      mulScalars(approx, filters.low),
      mulScalars(detail, filters.high),
    );
  }

  /**
   * Determines the maximum level of useful decomposition.
   * @param  dataLength Length of input data.
   * @param  wavelet    Wavelet to use.
   * @return            Maximum useful level of decomposition.
   */
  static maxLevel(
    dataLength: number,
    wavelet: Wavelet,
  ): number {
    /* Check for non-integer length. */
    if (!Number.isInteger(dataLength)) {
      throw new Error('Length of data is not an integer. This is not allowed.');
    }

    /* Check for invalid input. */
    if (dataLength < 0) {
      throw new Error('Data length cannot be less than zero.');
    }

    /* Return zero for data of zero length. */
    if (dataLength === 0) return 0;

    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);
    
    /* Determine length of filter. */
    const filterLength: number = waveletBasis.dec.low.length;

    // SOURCE: https://pywavelets.readthedocs.io/en/latest/ref/dwt-discrete-wavelet-transform.html#maximum-decomposition-level-dwt-max-level-dwtn-max-level
    return Math.floor(
      Math.log2(dataLength / (filterLength - 1))
    );
  }

  /**
   * 1D wavelet decomposition. Transforms data by calculating coefficients from
   * input data.
   * @param  data    Input data with a length equal to a power of two.
   * @param  wavelet Wavelet to use.
   * @return         Coefficients as result of the transform.
   */
  // TODO: Add option to stop after a certain level.
  static wavedec(
    data: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[][] {
    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);
    
    /* Use decomposition filters. */
    const filters: Filters = waveletBasis.dec;

    // TODO: Implement signal extension modes and remove/adjust assertion.
    /* Check if filters are valid for data. */
    assertValidFiltersForData(filters, data);

    /*  Initialize transform. */
    const maxLevel: number = this.maxLevel(data.length, wavelet);
    let coeffs: number[][] = [];
    let approx: number[] = data;

    /* Transform. */
    for (let level: number = 1; level <= maxLevel; level++) {
      /* Perform single level transform. */
      const approxDetail: number[][] = this.dwt(approx, wavelet);
      approx = approxDetail[0];
      const detail: number[] = approxDetail[1];

      /* Prepend detail coefficients. */
      coeffs.unshift(detail);
    }

    /* Prepend last approximation. */
    coeffs.unshift(approx);

    /* Return coefficients. */
    return coeffs;
  }

  /**
   * 1D wavelet reconstruction. Inverses a transform by calculating input data
   * from coefficients.
   * @param  coeffs  Coefficients as result of a transform.
   * @param  wavelet Wavelet to use.
   * @return         Input data as result of the inverse transform.
   */
  // TODO: Add option to stop after a certain level.
  static waverec(
    coeffs: number[][],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[] {
    /* Check if coefficients are valid. */
    assertValidCoeffs(coeffs);

    /* Initialize transform. */
    let approx: number[] = coeffs[0];

    /* Transform. */
    for (let i: number = 1; i < coeffs.length; i++) {
      /* Initialize detail coefficients. */
      const detail = coeffs[i];

      /* Calculate previous level of approximation. */
      approx = this.idwt(approx, detail, wavelet);
    }

    /* Return data. */
    return approx;
  }
}
