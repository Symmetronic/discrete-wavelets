import { PaddingMode } from '../padding';

/**
 * Symmetric padding.
 */
export const SYMMETRIC_PADDING: PaddingMode = 'symmetric';

/**
 * Returns a single value of symmetric padding.
 * @param  data       Input values.
 * @param  index      Index of padding.
 * @param  inversions Number of inversions.
 * @return            Single padding value.
 */
export function symmetricPadding(
  data: number[],
  index: number,
  inversions: number
): number {
  return (inversions % 2 === 0)
    ? data[index % data.length]
    : data[data.length - 1 - (index % data.length)];
};
