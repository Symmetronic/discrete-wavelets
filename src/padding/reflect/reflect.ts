import { PaddingMode } from '../padding';

/**
 * Reflect padding.
 */
export const REFLECT_PADDING: PaddingMode = 'reflect';

/**
 * Returns a single value of reflect padding.
 * @param  data    Input values.
 * @param  index   Index of padding.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function reflectPadding(
  data: ReadonlyArray<number>,
  index: number,
  inverse: boolean = false,
): number {
  /* Check if data has length larger than zero. */
  if (data.length === 0) {
    throw new Error(
      'Cannot determine reflect padding for data of zero length.'
    );
  }

  /* Return constant value for data of length one. */
  if (data.length === 1) return data[0];

  /* Determine reflect padding. */
  const dirChanges: number = Math.floor(index / (data.length - 1));
  const inversions: number = (inverse) ? dirChanges : dirChanges + 1;
  return (inversions % 2 === 0)
    ? data[index % (data.length - 1) + 1]
    : data[data.length - 2 - (index % (data.length - 1))];
};
