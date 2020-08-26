import {
  waveletDatasets,
} from './mocks';

import {
  assertValidCoeffs,
  basisFromWavelet,
  createArray,
  dot,
  isPowerOfTwo,
  mulScalar,
  mulScalars,
  padElement,
  padWidths,
  sum,
  assertValidFilters,
} from '../src/helpers';
import { PaddingModeAlias } from '../src/dwt';

describe('helpers', () => {

  describe('assertValidCoeffs', () => {
    it('throws an error for empty arrays', () => {
      expect(() => {
        assertValidCoeffs([]);
      }).toThrowError();
    });

    it('returns true for valid coefficients', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(assertValidCoeffs(dataset.dwt)).toBe(true);
          expect(assertValidCoeffs(dataset.wavedec)).toBe(true);
        }
      }
    });
  });

  describe('assertValidFilters', () => {
    it('throws an error for high-pass and low-pass filters of different length', () => {
      expect(() => {
        assertValidFilters({
          high: [0, 1],
          low: [0, 1, 2]
        });
      }).toThrowError();
    });

    it('throws an error for filters with a length lower than two', () => {
      expect(() => {
        assertValidFilters({
          high: [1],
          low: [-1]
        });
      }).toThrowError();
    });

    it('returns true for valid filters', () => {
      for (const waveletDataset of waveletDatasets) {
        expect(assertValidFilters(waveletDataset.wavelet.dec)).toBe(true);
        expect(assertValidFilters(waveletDataset.wavelet.rec)).toBe(true);
      }
    });
  });

  describe('basisFromWavelet', () => {
    it('returns the correct wavelets', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          expect(basisFromWavelet(alias)).toEqual(waveletDataset.wavelet);
        }
      }
    });
  });

  describe('createArray', () => {
    it('throws an error, if the length is not an integer', () => {
      expect(() => {
        createArray(3.14);
      }).toThrowError();
    });

    it('throws an error, if the length is less than zero', () => {
      expect(() => {
        createArray(-1);
      }).toThrowError();
    });

    it('populates an array with zeros by default', () => {
      expect(createArray(7)).toEqual([0, 0, 0, 0, 0, 0, 0]);
    });

    it('populates an array with a constant value', () => {
      expect(createArray(3, 42)).toEqual([42, 42, 42]);
    });

    it('populates an array with a functional value', () => {
      expect(createArray(4, (index) => index + 1)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('dot', () => {
    it('throws an error if the arrays do not have equal length', () => {
      expect(() => {
        dot([1], [2, 3]);
      }).toThrowError();

      expect(() => {
        dot([1, 2], [3]);
      }).toThrowError();
    });

    it('returns the dot product of the arrays', () => {
      expect(dot([2], [3])).toBe(6);
      expect(dot([-4, 2], [3, 0])).toBe(-12);
    });
  });

  describe('isPowerOfTwo', () => {
    it('returns false if a value is not a power of two', () => {
      expect(isPowerOfTwo(-4)).toBe(false);
      expect(isPowerOfTwo(0)).toBe(false);
      expect(isPowerOfTwo(3)).toBe(false);
      expect(isPowerOfTwo(5)).toBe(false);
      expect(isPowerOfTwo(50)).toBe(false);
    });

    it('returns true if a value is a power of two', () => {
      for (let i: number = 0; i < 10; i++) {
        expect(isPowerOfTwo(Math.pow(2, i))).toBe(true);
      }
    });
  });

  describe('mulScalar', () => {
    it('multiplies an array with a scalar value', () => {
      expect(mulScalar(1, [2])).toEqual([2]);
      expect(mulScalar(3, [-2, 0, 3])).toEqual([-6, 0, 9]);
    });
  });

  describe('mulScalars', () => {
    it('multiplies an array with an array of scalar values', () => {
      expect(mulScalars([1], [1])).toEqual([1]);
      expect(
        mulScalars([3, 1], [5, 0, -2, 1])
      ).toEqual([15, 0, -6, 3, 5, 0, -2, 1]);
    });
  });

  describe('padElement', () => {
    it('throws an error for an unknown padding mode', () => {
      expect(() => {
        padElement([1, 2, 3], 0, false, 'foobar' as PaddingModeAlias);
      }).toThrowError();
    });
  });

  describe('padWidths', () => {
    it('throws an error for a length of data less than or equal to zero', () => {
      expect(() => {
        padWidths(-1, 4, 'zero');
      }).toThrowError();

      expect(() => {
        padWidths(0, 4, 'zero');
      }).toThrowError();
    });

    it('throws an error for a length of filter less than two', () => {
      expect(() => {
        padWidths(8, 1, 'zero');
      }).toThrowError();

      expect(() => {
        padWidths(8, -1, 'zero');
      }).toThrowError();
    });

    it('pads in the front by the filter length minus 2', () => {
      for (let filterLength: number = 2; filterLength < 20; filterLength++) {
        expect(padWidths(4, filterLength, 'zero')[0]).toBe(filterLength - 2);
      }
    });

    it('pads in the back by the filter length minus 2 if data length plus filter length are even', () => {
      expect(padWidths(2, 2, 'zero')[1]).toBe(0);
      expect(padWidths(2, 4, 'zero')[1]).toBe(2);
      expect(padWidths(7, 5, 'zero')[1]).toBe(3);
    });

    it('pads in the back by the filter length minus 1 if data length plus filter length are odd', () => {
      expect(padWidths(3, 2, 'zero')[1]).toBe(1);
      expect(padWidths(4, 7, 'zero')[1]).toBe(6);
    });
  });

  describe('sum', () => {
    it('throws an error if the arrays do not have the same length', () => {
      expect(() => {
        sum([1], [2, 3]);
      }).toThrowError();

      expect(() => {
        sum([1, 2], [3]);
      }).toThrowError();
    });

    it('calculates the element-wise sum of two arrays', () => {
      expect(sum([0], [7])).toEqual([7]);
      expect(sum([1, 0], [-3, 4])).toEqual([-2, 4]);
    });
  });
});
