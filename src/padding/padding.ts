export * from './antisymmetric/antisymmetric';
export * from './constant/constant';
export * from './periodic/periodic';
export * from './reflect/reflect';
export * from './smooth/smooth';
export * from './symmetric/symmetric';
export * from './zero/zero';

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
 * List of supported signal extension modes.
 */
export const PADDING_MODES: PaddingMode[] = [
  ZERO_PADDING,
  CONSTANT_PADDING,
  SYMMETRIC_PADDING,
  PERIODIC_PADDING,
  SMOOTH_PADDING,
  REFLECT_PADDING,
  ANTISYMMETRIC_PADDING,
];

/**
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
