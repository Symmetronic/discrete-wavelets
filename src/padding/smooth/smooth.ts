import { PaddingMode } from '../padding';

/**
 * Smooth padding.
 */
export const SMOOTH_PADDING: PaddingMode = 'smooth';

/**
 * Returns a single value of smooth padding.
 * 
 * @param  data    Input values.
 * @param  index   Index of padding.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function smoothPadding(
  data: ReadonlyArray<number>,
  index: number,
  inverse: boolean = false,
): number {
  /* Check if data has length larger than zero. */
  if (data.length === 0) {
    throw new Error('Cannot determine smooth padding for data of zero length.');
  }

  /* Determine line equation. */
  const end: number = data.length - 1;
  const offset: number = (inverse) ? data[0] : data[end];
  const slope: number = (inverse)
    ? (data.length === 1) ? data[0] : data[0] - data[1]
    : (data.length === 1) ? -data[0] : data[end] - data[end - 1];
  return offset + (index + 1) * slope;
};
