import { PaddingMode } from '../padding';

/**
 * Symmetric padding.
 */
export const SYMMETRIC_PADDING: PaddingMode = 'symmetric';

/**
 * Returns a single value of symmetric padding.
 * @param  data    Input values.
 * @param  index   Index of padding.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function symmetricPadding(
  data: number[],
  index: number,
  inverse: boolean = false,
): number {
  const dirChanges: number = Math.floor(index / data.length);
  const inversions: number = (inverse) ? dirChanges : dirChanges + 1;
  return (inversions % 2 === 0)
    ? data[index % data.length]
    : data[data.length - 1 - (index % data.length)];
};
