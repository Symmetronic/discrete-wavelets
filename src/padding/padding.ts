export * from './constant/constant';
export * from './symmetric/symmetric';
export * from './zero/zero';

import { CONSTANT_PADDING } from './constant/constant';
import { SYMMETRIC_PADDING } from './symmetric/symmetric';
import { ZERO_PADDING } from './zero/zero';

/**
 * Signal extension mode.
 */
// TODO: Add more signal extension modes (https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#ref-modes)
export type PaddingMode =
    'constant'
    | 'symmetric'
    | 'zero';

/**
 * Signal extension mode alias.
 */
export type PaddingModeAlias =
    PaddingMode
    | 'sp0'
    | 'sym'
    | 'symh'
    | 'zpd';

/**
 * Mapping of padding mode keys to padding mode according to:
 * https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#naming-conventions
 */
export const PaddingModes: { [key: string]: PaddingMode } = {
  'constant': CONSTANT_PADDING,
  'sp0': CONSTANT_PADDING,
  'sym': SYMMETRIC_PADDING,
  'symh': SYMMETRIC_PADDING,
  'symmetric': SYMMETRIC_PADDING,
  'zero': ZERO_PADDING,
  'zpd': ZERO_PADDING,
};

/**
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
