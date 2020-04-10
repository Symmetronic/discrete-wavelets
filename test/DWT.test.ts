import {
  haarDatasets,
  waveletDatasets,
} from './mocks';

import DWT from "../src/DWT"
import {
  HaarWavelet,
} from "../src/wavelets/wavelets";

/**
 * Precision to use for comparing floats.
 */
const PRECISION: number = 8;

/**
 * Determines if two floating point values are close to each other (equal).
 * @param  value1    Floating point value.
 * @param  value2    Floating point value.
 * @param  precision Precision to check for closeness.
 * @return           True if both values are close to each other with respect to the precision, otherwise false.
 */
function closeTo(
  value1: number,
  value2: number,
  precision: number = PRECISION,
): boolean {
  return Math.abs(value1 - value2) < Math.pow(10, -1 * precision);
}

/**
 * Determines if two sets of coefficients are equal.
 * @param  coeffs1 First set of coefficients.
 * @param  coeffs2 Second set of coefficients.
 * @return         True if both sets of coefficients are equal, otherwise false.
 */
function equalCoeffs(coeffs1: number[][], coeffs2: number[][]): boolean {
  /* Unequal lengths of coefficients. */
  if (coeffs1.length !== coeffs2.length) return false;

  for (let i: number = 0; i < coeffs1.length; i++) {
    /* Unequal lengths of slice of coefficients. */
    if (coeffs1[i].length !== coeffs2[i].length) return false;

    for (let j: number = 0; j < coeffs1[i].length; j++) {
      /* Unequal coefficients. */
      if (!closeTo(coeffs1[i][j], coeffs2[i][j])) return false;
    }
  }

  /* Equal coefficients. */
  return true;
}

/**
 * Determines if two arrays of data are equal.
 * @param  data1 First array of data.
 * @param  data2 Second array of data.
 * @return       True if both arrays of data are equal, otherwise false.
 */
function equalData(data1: number[], data2: number[]): boolean {
  /* Unequal lengths of data. */
  if (data1.length !== data2.length) return false;

  for (let i: number = 0; i < data1.length; i++) {
    /* Unequal data. */
    if (!closeTo(data1[i], data2[i])) return false;
  }

  /* Equal data. */
  return true;
}

describe('DWT', () => {

  it('DWT exists', () => {
    expect(new DWT()).toBeInstanceOf(DWT);
  });

  describe('energy', () => {
    it('calculates energy for empty values', () => {
      expect(DWT.energy([])).toBe(0);
      expect(DWT.energy([[], [], []])).toBe(0);
    });

    it('calculates the energy of input data', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(
            DWT.energy(dataset.data)
          ).toBeCloseTo(dataset.energy, PRECISION);
        }
      }
    });

    it('calculates the energy of coefficients', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(
            DWT.energy(dataset.coeffs)
          ).toBeCloseTo(dataset.energy, PRECISION);
        }
      }
    });
  });

  describe('invTransform', () => {

    it('throws an error if the coefficients have zero length', () => {
      expect(() => {
        DWT.invTransform([]);
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have unequal length', () => {
      expect(() => {
        DWT.invTransform(
          haarDatasets[0].coeffs,
          {
            ...HaarWavelet,
            rec: {
              ...HaarWavelet.dec,
              high: [...HaarWavelet.dec.high, 1, -1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have uneven length', () => {
      expect(() => {
        DWT.invTransform(
          haarDatasets[0].coeffs,
          {
            ...HaarWavelet,
            rec: {
              low: [1],
              high: [1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if any pair of approximation and detail coefficients on the same level does not have equal length', () => {
      expect(() => {
        DWT.invTransform(
          [
            [1, 2],
            [3],
          ]
        )
      }).toThrowError();

      expect(() => {
        DWT.invTransform(
          [
            [1],
            [2],
            [3, 4, 5],
          ]
        )
      }).toThrowError();
    });

    it('calculates the inverse Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalData(DWT.invTransform(dataset.coeffs), dataset.data));
      }
    });

    it('calculates the inverse discrete wavelet transform', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(
              equalData(DWT.invTransform(dataset.coeffs, alias), dataset.data)
            );
          }
        }
      }
    });
  });

  describe('transform', () => {
  
    it('throws an error if the input has a length other than a power of 2', () => {
      expect(() => {
        DWT.transform([4, 8, 16])
      }).toThrowError();
      
      expect(() => {
        DWT.transform([32, 64, 128, 256, 512])
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have unequal length', () => {
      expect(() => {
        DWT.transform(
          haarDatasets[0].data,
          {
            ...HaarWavelet,
            dec: {
              ...HaarWavelet.dec,
              high: [...HaarWavelet.dec.high, 1, -1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have uneven length', () => {
      expect(() => {
        DWT.transform(
          haarDatasets[0].data,
          {
            ...HaarWavelet,
            dec: {
              low: [1],
              high: [1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if the input has a length lower than the length of filters of the wavelet basis', () => {
      expect(() => {
        DWT.transform([], 'D2');
      }).toThrowError();
  
      expect(() => {
        DWT.transform([2], 'D2');
      }).toThrowError();
    });

    it('calculates the Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalCoeffs(DWT.transform(dataset.data), dataset.coeffs));
      }
    });

    it('calculates the discrete wavelet transform', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(
              equalCoeffs(DWT.transform(dataset.data, alias), dataset.coeffs)
            );
          }
        }
      }
    });
  });
});
