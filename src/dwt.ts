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
   * Inverses a transform by calculating input data from coefficients.
   * @param  coeffs  Coefficients as result of a transform.
   * @param  wavelet Wavelet to use.
   * @return         Input data as result of the inverse transform.
   */
  // TODO: Add option to stop after a certain level.
  static invTransform(
    coeffs: number[][],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[] {
    /* Check if coefficients are valid. */
    assertValidCoeffs(coeffs);

    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);

    /* Use reconstruction filters. */
    const filters: Filters = waveletBasis.rec;

    /* Check if filters are valid. */
    assertValidFilters(filters);

    /* Check if filters are valid for coeffs. */
    assertValidFiltersForCoeffs(filters, coeffs);

    /* Initialize transform. */
    let approx: number[] = coeffs[0];

    /* Transform. */
    for (let i: number = 1; i < coeffs.length; i++) {
      /* Initialize detail coefficients. */
      const detail = coeffs[i];

      /* Calculate previous level of approximation. */
      approx = sum(
        mulScalars(approx, filters.low),
        mulScalars(detail, filters.high),
      );
    }

    /* Return data. */
    return approx;
  }

  /**
   * Transforms data by calculating coefficients from input data.
   * @param  data    Input data with a length equal to a power of two.
   * @param  wavelet Wavelet to use.
   * @return         Coefficients as result of the transform.
   */
  // TODO: Add option to stop after a certain level.
  static transform(
    data: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[][] {
    /* Check if data is valid. */
    assertValidData(data);

    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);
    
    /* Use decomposition filters. */
    const filters: Filters = waveletBasis.dec;

    /* Check if filters are valid. */
    assertValidFilters(filters);

    /* Check if filters are valid for data. */
    assertValidFiltersForData(filters, data);

    /*  Initialize transform. */
    let coeffs: number[][] = [];
    let prevApprox: number[] = data;

    /* Transform. */
    while (prevApprox.length > 1) {
      /* Initialize approximation and detail coefficients. */
      let approx: number[] = [];
      let detail: number[] = [];

      /* Calculate coefficients. */
      for (let offset: number = 0; offset < prevApprox.length; offset += 2) {
        /* Determine slice of values. */
        const end: number = offset + filters.low.length;
        const wrappedEnd: number = end - prevApprox.length;
        const values: number[] = (wrappedEnd < 0)
            /* Slice values. */
            ? prevApprox.slice(offset, end)
            /* Slice values to end and add additional values from start. */
            : prevApprox.slice(offset).concat(prevApprox.slice(0, wrappedEnd));

        /* Calculate approximation coefficients. */
        approx.push(
          dot(values, filters.low)
        );

        /* Calculate detail coefficients. */
        detail.push(
          dot(values, filters.high)
        );
      }

      /* Prepend detail coefficients. */
      coeffs.unshift(detail);

      /* Continue iteration on approximation. */
      prevApprox = approx;
    }

    /* Prepend last approximation. */
    coeffs.unshift(prevApprox);

    /* Return coefficients. */
    return coeffs;
  }
}
