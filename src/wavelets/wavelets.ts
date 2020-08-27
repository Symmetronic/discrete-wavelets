export * from './db2/db2';
export * from './db3/db3';
export * from './haar/haar';

import { Db2Wavelet } from './db2/db2';
import { Db3Wavelet } from './db3/db3';
import { HaarWavelet } from "./haar/haar";

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
// TODO: Add other db wavelets
export const ScalingNumbers: { [key: string]: number[] } = {
  'db1': HaarWavelet,
  'db2': Db2Wavelet,
  'db3': Db3Wavelet,
  'D2': HaarWavelet,
  'D4': Db2Wavelet,
  'D6': Db3Wavelet,
  'haar': HaarWavelet,
};

/**
 * Short forms for common wavelet bases.
 */
export type WaveletType =
    'db1' | 'D2' | 'haar'
    | 'db2' | 'D4'
    | 'db3' | 'D6';
