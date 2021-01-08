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
  data: ReadonlyArray<number>,
  index: number,
  inverse: boolean = false,
): number {
  /* Check if data has length larger than zero. */
  if (data.length === 0) {
    throw new Error(
      'Cannot determine periodic padding for data of zero length.'
    );
  }

  /* Determine periodic padding. */
  return (!inverse)
    ? data[index % data.length]
    : data[data.length - 1 - (index % data.length)];
};
