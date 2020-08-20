import {
  waveletDatasets,
} from './mocks';

import {
  HaarWavelet,
} from '../src/wavelets/wavelets';

import {
  assertValidCoeffs,
  assertValidData,
  assertValidFilters,
  assertValidFiltersForCoeffs,
  assertValidFiltersForData,
  basisFromWavelet,
  createArray,
  dot,
  isPowerOfTwo,
  mulScalar,
  mulScalars,
  sum,
} from '../src/helpers';

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
          expect(assertValidCoeffs(dataset.coeffs)).toBe(true);
        }
      }
    });
  });

  describe('assertValidData', () => {
    it('throws an error if the length of data is not a power of 2', () => {
      expect(() => {
        assertValidData([]);
      }).toThrowError();

      expect(() => {
        assertValidData([1, 2, 3]);
      }).toThrowError();
    });

    it('returns true for valid data', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(assertValidData(dataset.data)).toBe(true);
        }
      }
    });
  });

  describe('assertValidFilters', () => {
    it('throws an error if the high-pass and low-pass filters have a different length', () => {
      expect(() => {
        assertValidFilters({
          high: [1],
          low: [2, 3],
        });
      }).toThrowError();
    });

    it('throws an error if the filters have an uneven length', () => {
      expect(() => {
        assertValidFilters({
          high: [1],
          low: [1],
        });
      }).toThrowError();

      expect(() => {
        assertValidFilters({
          high: [1, 2, 3],
          low: [4, 5, 6],
        })
      }).toThrowError();
    });

    it('returns true for valid filters', () => {
      for (const waveletDataset of waveletDatasets) {
        expect(assertValidFilters(waveletDataset.wavelet.dec)).toBe(true);
        expect(assertValidFilters(waveletDataset.wavelet.rec)).toBe(true);
      }
    });
  });

  describe('assertValidFiltersForCoeffs', () => {
    it('throws an error if approximation and detail coefficients on the same level have different length', () => {
      expect(() => {
        assertValidFiltersForCoeffs(
          HaarWavelet.rec,
          [[1], [2, 3]],
        );
      }).toThrowError();

      expect(() => {
        assertValidFiltersForCoeffs(
          HaarWavelet.rec,
          [[1], [2], [3, 4, 5]],
        );
      }).toThrowError();
    });

    it('returns true for valid filters for the coefficients', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(assertValidFiltersForCoeffs(
            waveletDataset.wavelet.rec,
            dataset.coeffs
          )).toBe(true);
        }
      }
    });
  });
  
  describe('assertValidFiltersForData', () => {
    it('throws an error if the length of the data is less than the length of the filters', () => {
      expect(() => {
        assertValidFiltersForData(HaarWavelet.dec, []);
      }).toThrowError();

      expect(() => {
        assertValidFiltersForData(HaarWavelet.dec, [1]);
      }).toThrowError();
    });

    it('returns true for valid filters for the data', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(
            assertValidFiltersForData(waveletDataset.wavelet.dec, dataset.data)
          ).toBe(true); 
        }
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
