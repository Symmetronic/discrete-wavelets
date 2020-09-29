import { PaddingMode } from '../padding';
import { symmetricPadding } from '../symmetric/symmetric';

/**
 * Antisymmetric padding.
 */
export const ANTISYMMETRIC_PADDING: PaddingMode = 'antisymmetric';

/**
 * Returns a single value of antisymmetric padding.
 * @param  data    Input values.
 * @param  index   Index of padding.
 * @param  inverse True if the direction should be inversed.
 * @return         Single padding value.
 */
export function antisymmetricPadding(
  data: number[],
  index: number,
  inverse: boolean = false,
): number {
  const dirChanges: number = Math.floor(index / data.length);
  const sign: number = (dirChanges % 2 === 0) ? -1 : 1;
  return sign * symmetricPadding(data, index, inverse);
};
