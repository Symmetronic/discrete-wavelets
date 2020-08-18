import {
  haarDatasets,
  waveletDatasets,
} from './mocks';

import dwt from "../src/dwt"
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

describe('dwt', () => {

  it('dwt exists', () => {
    expect(new dwt()).toBeInstanceOf(dwt);
  });

  describe('dwt', () => {

    // TODO: Remove condition concerning power of 2 and test.
    it('throws an error if the input has a length other than a power of 2', () => {
      expect(() => {
        dwt.dwt([9, 5, 3]);
      }).toThrowError();

      expect(() => {
        dwt.dwt([4, 5, 6, 3, 6]);
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have unequal length', () => {
      expect(() => {
        dwt.dwt(
          haarDatasets[0].data,
          {
            ...HaarWavelet,
            dec: {
              ...HaarWavelet.dec,
              high: [...HaarWavelet.dec.high, -1, 1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have uneven length', () => {
      expect(() => {
        dwt.dwt(
          haarDatasets[0].data,
          {
            ...HaarWavelet,
            dec: {
              low: [1],
              high: [-1],
            },
          },
        );
      }).toThrowError();
    });

    // TODO: Remove condition and test after introducing signal extension modes (padding)
    it('throws an error if the input has a length lower than the length of filters of the wavelet basis', () => {
      expect(() => {
        dwt.dwt([], 'D2');
      }).toThrowError();
  
      expect(() => {
        dwt.dwt([2], 'D2');
      }).toThrowError();
    });

    it('calculates the Haar DWT by default', () => {
      expect(equalCoeffs(
        dwt.dwt([1, 2, 3, 4]),
        [
          [(1 + 2) / Math.SQRT2, (3 + 4) / Math.SQRT2],
          [(1 - 2) / Math.SQRT2, (3 - 4) / Math.SQRT2],
        ],
      ));
    });
  });

  describe('energy', () => {
    it('calculates energy for empty values', () => {
      expect(dwt.energy([])).toBe(0);
      expect(dwt.energy([[], [], []])).toBe(0);
    });

    it('calculates the energy of input data', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(
            dwt.energy(dataset.data)
          ).toBeCloseTo(dataset.energy, PRECISION);
        }
      }
    });

    it('calculates the energy of coefficients', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const dataset of waveletDataset.datasets) {
          expect(
            dwt.energy(dataset.coeffs)
          ).toBeCloseTo(dataset.energy, PRECISION);
        }
      }
    });
  });

  describe('wavedec', () => {
  
    // TODO: Remove condition concerning power of 2 and test.
    it('throws an error if the input has a length other than a power of 2', () => {
      expect(() => {
        dwt.wavedec([4, 8, 16]);
      }).toThrowError();
      
      expect(() => {
        dwt.wavedec([32, 64, 128, 256, 512]);
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have unequal length', () => {
      expect(() => {
        dwt.wavedec(
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
        dwt.wavedec(
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

    // TODO: Remove condition and test after introducing signal extension modes (padding)
    it('throws an error if the input has a length lower than the length of filters of the wavelet basis', () => {
      expect(() => {
        dwt.wavedec([], 'D2');
      }).toThrowError();
  
      expect(() => {
        dwt.wavedec([2], 'D2');
      }).toThrowError();
    });

    it('calculates the Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalCoeffs(dwt.wavedec(dataset.data), dataset.coeffs));
      }
    });

    it('calculates the discrete wavelet transform', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(
              equalCoeffs(dwt.wavedec(dataset.data, alias), dataset.coeffs)
            );
          }
        }
      }
    });
  });

  describe('waverec', () => {

    it('throws an error if the coefficients have zero length', () => {
      expect(() => {
        dwt.waverec([]);
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have unequal length', () => {
      expect(() => {
        dwt.waverec(
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
        dwt.waverec(
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
        dwt.waverec(
          [
            [1, 2],
            [3],
          ]
        )
      }).toThrowError();

      expect(() => {
        dwt.waverec(
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
        expect(equalData(dwt.waverec(dataset.coeffs), dataset.data));
      }
    });

    it('calculates the inverse discrete wavelet transform', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(
              equalData(dwt.waverec(dataset.coeffs, alias), dataset.data)
            );
          }
        }
      }
    });
  });
});
