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
 * Signal extension mode alias.
 */
export type PaddingModeAlias =
    PaddingMode
    | 'asym'
    | 'asymh'
    | 'ppd'
    | 'sp0'
    | 'sp1'
    | 'spd'
    | 'sym'
    | 'symh'
    | 'symw'
    | 'zpd';

/**
 * Mapping of padding mode keys to padding mode according to:
 * https://pywavelets.readthedocs.io/en/latest/ref/signal-extension-modes.html#naming-conventions
 */
export const PaddingModes: { [key: string]: PaddingMode } = {
  'antisymmetric': ANTISYMMETRIC_PADDING,
  'asym': ANTISYMMETRIC_PADDING,
  'asymh': ANTISYMMETRIC_PADDING,
  'constant': CONSTANT_PADDING,
  'periodic': PERIODIC_PADDING,
  'ppd': PERIODIC_PADDING,
  'reflect': REFLECT_PADDING,
  'smooth': SMOOTH_PADDING,
  'sp0': CONSTANT_PADDING,
  'sp1': SMOOTH_PADDING,
  'spd': SMOOTH_PADDING,
  'sym': SYMMETRIC_PADDING,
  'symh': SYMMETRIC_PADDING,
  'symw': REFLECT_PADDING,
  'symmetric': SYMMETRIC_PADDING,
  'zero': ZERO_PADDING,
  'zpd': ZERO_PADDING,
};

/**
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
