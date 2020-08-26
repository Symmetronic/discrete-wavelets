import { PaddingMode } from '../padding';

/**
 * Constant padding.
 */
export const CONSTANT_PADDING: PaddingMode = 'constant';

/**
 * Returns a single value of constant padding.
 * @param  data    Input values.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function constantPadding(
  data: number[],
  inverse: boolean = false,
): number {
  return (!inverse)
    ? data[data.length - 1]
    : data[0];
};
