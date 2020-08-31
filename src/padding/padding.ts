export { antisymmetricPadding } from './antisymmetric/antisymmetric';
export { constantPadding } from './constant/constant';
export { periodicPadding } from './periodic/periodic';
export { reflectPadding } from './reflect/reflect';
export { smoothPadding } from './smooth/smooth';
export { symmetricPadding } from './symmetric/symmetric';
export { zeroPadding } from './zero/zero';

import { ANTISYMMETRIC_PADDING } from './antisymmetric/antisymmetric';
import { CONSTANT_PADDING } from './constant/constant';
import { PERIODIC_PADDING } from './periodic/periodic';
import { REFLECT_PADDING } from './reflect/reflect';
import { SMOOTH_PADDING } from './smooth/smooth';
import { SYMMETRIC_PADDING } from './symmetric/symmetric';
import { ZERO_PADDING } from './zero/zero';

/**
 * Signal extension mode.
 */
export type PaddingMode =
    'antisymmetric'
    | 'constant'
    | 'periodic'
    | 'reflect'
    | 'smooth'
    | 'symmetric'
    | 'zero';

/**
 * Interface of supported padding mode.
 */
export interface PaddingModes {
  antisymmetric: PaddingMode;
  constant: PaddingMode;
  modes: PaddingMode[];
  periodic: PaddingMode;
  reflect: PaddingMode;
  smooth: PaddingMode;
  symmetric: PaddingMode;
  zero: PaddingMode;
}

/**
 * Supported signal extension modes.
 */
export const PADDING_MODES: PaddingModes = {
  antisymmetric: ANTISYMMETRIC_PADDING,
  constant: CONSTANT_PADDING,
  periodic: PERIODIC_PADDING,
  reflect: REFLECT_PADDING,
  smooth: SMOOTH_PADDING,
  symmetric: SYMMETRIC_PADDING,
  zero: ZERO_PADDING,
  modes: [
    ZERO_PADDING,
    CONSTANT_PADDING,
    SYMMETRIC_PADDING,
    PERIODIC_PADDING,
    SMOOTH_PADDING,
    REFLECT_PADDING,
    ANTISYMMETRIC_PADDING,
  ],
};

/**
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
