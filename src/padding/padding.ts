export * from './antisymmetric/antisymmetric';
export * from './constant/constant';
export * from './periodic/periodic';
export * from './reflect/reflect';
export * from './smooth/smooth';
export * from './symmetric/symmetric';
export * from './zero/zero';

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
 * Number of padded values at front and back.
 */
export type PaddingWidths = [number, number];
