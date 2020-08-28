export * from './daubechies/daubechies';

import {
  Db2Wavelet,
  Db3Wavelet,
  Db4Wavelet,
  Db5Wavelet,
  Db6Wavelet,
  Db7Wavelet,
  Db8Wavelet,
  HaarWavelet,
} from './daubechies/daubechies';

/**
 * Filters for a transform.
 */
export interface Filters {
  
  /**
   * High-pass filter.
   */
  high: number[];

  /**
   * Low-pass filter.
   */
  low: number[];
};

/**
 * A wavelet, which can either be described by a wavelet basis or a wavelet
 * type.
 */
export type Wavelet = WaveletBasis | WaveletType;

/**
 * A wavelet basis.
 */
export interface WaveletBasis {

  /**
   * Decomposition filters.
   */
  dec: Filters;

  /**
   * Reconstruction filters.
   */
  rec: Filters;
}

/**
 * Mapping of wavelet type keys to scaling numbers.
 */
export const ScalingNumbers: { [key: string]: number[] } = {
  'db1': HaarWavelet,
  'db2': Db2Wavelet,
  'db3': Db3Wavelet,
  'db4': Db4Wavelet,
  'db5': Db5Wavelet,
  'db6': Db6Wavelet,
  'db7': Db7Wavelet,
  'db8': Db8Wavelet,
  'D2': HaarWavelet,
  'D4': Db2Wavelet,
  'D6': Db3Wavelet,
  'D8': Db4Wavelet,
  'D10': Db5Wavelet,
  'D12': Db6Wavelet,
  'D14': Db7Wavelet,
  'D16': Db8Wavelet,
  'haar': HaarWavelet,
};

/**
 * Short forms for common wavelet bases.
 */
export type WaveletType =
    'db1' | 'D2' | 'haar'
    | 'db2' | 'D4'
    | 'db3' | 'D6'
    | 'db4' | 'D8'
    | 'db5' | 'D10'
    | 'db6' | 'D12'
    | 'db7' | 'D14'
    | 'db8' | 'D16';
