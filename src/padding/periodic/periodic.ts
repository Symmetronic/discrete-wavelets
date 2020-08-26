import { PaddingMode } from '../padding';

/**
 * Periodic padding.
 */
export const PERIODIC_PADDING: PaddingMode = 'periodic';

/**
 * Returns a single value of periodic padding.
 * @param  data    Input values.
 * @param  index   Index of padding.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function periodicPadding(
  data: number[],
  index: number,
  inverse: boolean = false,
): number {
  return (!inverse)
    ? data[index % data.length]
    : data[data.length - 1 - (index % data.length)];
};
