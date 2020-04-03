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
 * Mapping of wavelet type keys to wavelet bases.
 */
// TODO: Add other db wavelets
export const Wavelets: { [key: string]: WaveletBasis } = {
  'db1': HaarWavelet,
  'D2': HaarWavelet,
  'haar': HaarWavelet,
};

/**
 * Short forms for common wavelet bases.
 */
export type WaveletType = 'db1' | 'D2' | 'haar';
