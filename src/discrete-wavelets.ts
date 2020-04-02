import {
  dot,
  isPowerOfTwo,
  waveletFromType,
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
export default class DWT {

  /**
   * Calculates the energy as sum of squares of an array of data or
   * coefficients.
   * @param  values Values to compute the energy.
   * @return        Energy of values.
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
   * @param  coeffs  Coefficients as result of transform.
   * @param  wavelet Wavelet to use.
   * @return         Input data as result of the inverse transform.
   */
  static invTransform(
    coeffs: number[][],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[] {
    return [];
  }

  /**
   * Transforms data by calculating coefficients from input data.
   * @param  data    Input data.
   * @param  wavelet Wavelet to use.
   * @return         Coefficients as result of the transform.
   */
  static transform(
    data: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
  ): number[][] {
    /* Check for minimum data length. */
    if (data.length < 2) {
      throw new Error(
        'Input data has to have a length larger than or equal to 2.'
      );
    }
    
    /* Check if length is a power of two. */
    if (!isPowerOfTwo(data.length)) {
      throw new Error('Input data has to have the length of a power of 2.');
    }

    /* Determine wavelet basis. */
    const waveletBasis: WaveletBasis = (typeof wavelet !== 'string')
        /* Use wavelet. */
        ? wavelet
        /* Determine wavelet from type. */
        : waveletFromType(wavelet);
    
    /* Use decomposition filters. */
    const filters: Filters = waveletBasis.dec;
    const len: number = filters.high.length;

    /* Check for invalid wavelet basis. */
    if (filters.low.length !== len) {
      throw new Error(
        'Invalid wavelet basis. Low-pass and high-pass filters have different length.'
      );
    }
    if (len % 2 !== 0) {
      throw new Error(
        'Invalid wavelet basis. Filters have to have even length.'
      );
    }

    /*  Initialize transform. */
    let coeffs: number[][] = [];
    let prevApprox: number[] = data;

    /* Transform. */
    while (true) {
      /* Initialize approximation and detail coefficients. */
      let approx: number[] = [];
      let detail: number[] = [];

      /* Calculate coefficients. */
      for (let offset: number = 0; offset < prevApprox.length; offset += 2) {
        // TODO: Add values from beginning if length and offset are larger than slice length
        const end: number = offset + len;
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

      if (approx.length > 1) {
        /* Continue iteration on approximation. */
        prevApprox = approx;
      } else {
        /* Prepend approximation coefficients. */
        coeffs.unshift(approx);
        break;
      }
    }

    /* Return coefficients. */
    return coeffs;
  }
}
