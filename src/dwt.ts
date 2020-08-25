export {
  CONSTANT_PADDING,
  PaddingMode,
  PaddingModeAlias,
  PaddingWidths,
  ZERO_PADDING,
} from './padding/padding';

export {
  Filters,
  Wavelet,
  WaveletBasis,
  WaveletType,
} from './wavelets/wavelets';

import {
  assertValidCoeffs,
  assertValidFilters,
  basisFromWavelet,
  createArray,
  dot,
  mulScalars,
  paddingFromAlias,
  padWidths,
  sum,
} from './helpers';

import {
  CONSTANT_PADDING,
  PaddingMode,
  PaddingModeAlias,
  PaddingWidths,
  ZERO_PADDING,
} from './padding/padding';

import {
  Filters,
  Wavelet,
  WaveletBasis,
} from "./wavelets/wavelets";

/**
 * Default padding mode to use.
 */
const DEFAULT_PADDING_MODE: PaddingMode = 'zero';

/**
 * Default wavelet to use.
 */
const DEFAULT_WAVELET: Wavelet = 'haar';

/**
 * Collection of methods for Discrete Wavelet Transform (DWT).
 */
export default class dwt {

  /**
   * Single level Discrete Wavelet Transform.
   * @param  data    Input data.
   * @param  wavelet Wavelet to use.
   * @param  mode    Signal extension mode alias.
   * @return         Approximation and detail coefficients as result of the transform.
   */
  static dwt(
    data: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
    mode: PaddingModeAlias = DEFAULT_PADDING_MODE,
  ): number[][] {
    /* Determine wavelet basis and filters. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);
    const filters: Filters = waveletBasis.dec;
    assertValidFilters(filters);
    const filterLength: number = filters.low.length;

    /* Add padding. */
    data = this.pad(
      data,
      padWidths(data.length, filterLength, mode),
      mode
    );

    /* Initialize approximation and detail coefficients. */
    let approx: number[] = [];
    let detail: number[] = [];

    /* Calculate coefficients. */
    for (let offset: number = 0; offset < data.length; offset += 2) {
      /* Determine slice of values. */
      const values: number[] = data.slice(offset, offset + filterLength);

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
   * Single level inverse Discrete Wavelet Transform.
   * @param  approx  Approximation coefficients.
   * @param  detail  Detail coefficients.
   * @param  wavelet Wavelet to use.
   * @param  mode    Signal extension mode alias.
   * @return         Approximation coefficients of previous level of transform.
   */
  static idwt(
    approx: number[],
    detail: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
    mode: PaddingModeAlias = DEFAULT_PADDING_MODE,
  ): number[] {
    /* Determine wavelet basis and filters. */
    const waveletBasis: WaveletBasis = basisFromWavelet(wavelet);
    const filters: Filters = waveletBasis.rec;
    assertValidFilters(filters);
    const filterLength: number = filters.low.length;

    /* Calculate padded approximation of previous level of transform. */
    const padded: number[] = sum(
      mulScalars(approx, filters.low),
      mulScalars(detail, filters.high),
    );

    /* Remove padding. */
    // TODO: Capsulate in separate function.
    // TODO: Use signal extension mode.
    return padded.slice(
      filterLength - 2,
      padded.length - 2 * (filterLength - 2) 
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
   * Extends a signal with a given padding mode.
   * @param  data      Input data.
   * @param  padWidths Widths of padding at front and back.
   * @param  mode      Signal extension mode alias.
   * @return           Data with padding.
   */
  static pad(
    data: number[],
    padWidths: PaddingWidths,
    mode: PaddingModeAlias,
  ): number[] {
    /* Initialize. */
    mode = paddingFromAlias(mode);
    const front: number = padWidths[0];
    const back: number = padWidths[1];

    /* Add padding. */
    switch (mode) {
      case CONSTANT_PADDING:
        return createArray(front, data[0])
            .concat(data)
            .concat(createArray(back, data[data.length - 1]));
      case ZERO_PADDING:
        return createArray(front, 0)
            .concat(data)
            .concat(createArray(back, 0));
      default:
        throw new Error('Unknown padding mode: "' + mode + '"')
    }
  }

  /**
   * 1D wavelet decomposition. Transforms data by calculating coefficients from
   * input data.
   * @param  data    Input data.
   * @param  wavelet Wavelet to use.
   * @param  mode    Signal extension mode alias.
   * @param  level   Decomposition level. Defaults to level calculated by maxLevel function.
   * @return         Coefficients as result of the transform.
   */
  static wavedec(
    data: number[],
    wavelet: Wavelet = DEFAULT_WAVELET,
    mode: PaddingModeAlias = DEFAULT_PADDING_MODE,
    level?: number,
  ): number[][] {
    /* Determine decomposition level. */
    if (level === undefined) level = this.maxLevel(data.length, wavelet);
    if (level < 0) {
      throw new Error('Decomposition level must not be less than zero');
    }

    /*  Initialize transform. */
    let coeffs: number[][] = [];
    let approx: number[] = data;

    /* Transform. */
    for (let l: number = 1; l <= level; l++) {
      /* Perform single level transform. */
      const approxDetail: number[][] = this.dwt(approx, wavelet, mode);
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
   * @param  mode    Signal extension mode.
   * @return         Input data as result of the inverse transform.
   */
  static waverec(
    coeffs: number[][],
    wavelet: Wavelet = DEFAULT_WAVELET,
    mode: PaddingModeAlias = DEFAULT_PADDING_MODE,
  ): number[] {
    /* Check if coefficients are valid. */
    assertValidCoeffs(coeffs);

    /* Determine wavelet. */
    wavelet = basisFromWavelet(wavelet);

    /* Initialize transform. */
    let approx: number[] = coeffs[0];

    /* Transform. */
    for (let i: number = 1; i < coeffs.length; i++) {
      /* Initialize detail coefficients. */
      const detail = coeffs[i];

      // TODO: Check if problem of different coefficient lengths because of padding can be solved in a more elegant way.
      if (approx.length === detail.length + 1) {
        approx = approx.slice(0, approx.length - 1);
      }

      /* Calculate previous level of approximation. */
      approx = this.idwt(approx, detail, wavelet, mode);
    }

    /* Return data. */
    return approx;
  }
}
