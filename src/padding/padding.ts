/**
 * Signal extension mode.
 */
// TODO: Add more signal extension modes (https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#ref-modes)
// TODO: Add aliases according to: https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#naming-conventions
export type PaddingMode =
    'constant'
    | 'zero';

/**
 * Signal extension mode alias.
 */
export type PaddingModeAlias =
    PaddingMode
    | 'sp0'
    | 'zpd';

/**
 * Constant padding type.
 */
export const CONSTANT_PADDING: PaddingMode = 'constant';

/**
 * Zero padding type.
 */
export const ZERO_PADDING: PaddingMode = 'zero';

/**
 * Mapping of padding mode keys to padding mode according to:
 * https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#naming-conventions
 */
export const PaddingModes: { [key: string]: PaddingMode } = {
  'constant': CONSTANT_PADDING,
  'sp0': CONSTANT_PADDING,
  'zero': ZERO_PADDING,
  'zpd': ZERO_PADDING,
};

/**
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
