import { PaddingMode } from '../padding';

/**
 * Constant padding.
 */
export const CONSTANT_PADDING: PaddingMode = 'constant';

/**
 * Returns a single value of constant padding.
 * 
 * @param  data    Input values.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function constantPadding(
  data: ReadonlyArray<number>,
  inverse: boolean = false,
): number {
  /* Check if data has length larger than zero. */
  if (data.length === 0) {
    throw new Error(
      'Cannot determine constant padding for data of zero length.'
    );
  }

  /* Determine constant padding. */
  return (!inverse)
    ? data[data.length - 1]
    : data[0];
};
