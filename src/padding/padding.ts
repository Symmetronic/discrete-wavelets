/**
 * Signal extension mode.
 */
// TODO: Add more signal extension modes (https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#ref-modes)
export type PaddingMode = 'constant' | 'zero';

/**
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
