import {
  Dataset,
  haarDatasets,
  waveletDatasets,
} from './mocks';

import dwt from "../src/dwt"
import {
  createArray,
  waveletFromScalingNumbers,
} from '../src/helpers';
import {
  PaddingMode,
} from '../src/padding/padding';
import {
  HaarWavelet,
  WaveletBasis,
} from "../src/wavelets/wavelets";

/**
 * Haar wavelet basis
 */
const HAAR_WAVELET: WaveletBasis = waveletFromScalingNumbers(HaarWavelet);

/**
 * Precision to use for comparing floats.
 */
const PRECISION: number = 6;

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
  if (coeffs1.length !== coeffs2.length) {
    console.error('Coefficient lengths ' + coeffs1.length + ' and ' + coeffs2.length + ' are not equal.'); 
    return false;
  }

  for (let i: number = 0; i < coeffs1.length; i++) {
    /* Unequal lengths of slice of coefficients. */
    if (coeffs1[i].length !== coeffs2[i].length) {
      console.error('Coefficient lengths ' + coeffs1.length + ' and ' + coeffs2.length + ' are not equal.');
      return false;
    }

    for (let j: number = 0; j < coeffs1[i].length; j++) {
      /* Unequal coefficients. */
      if (!closeTo(coeffs1[i][j], coeffs2[i][j])) {
        console.error('Coefficients ' + coeffs1[i][j] + ' and ' + coeffs2[i][j] + ' are not equal.');
        return false;
      }
    }
  }

  /* Equal coefficients. */
  return true;
}

/**
 * Determines if two arrays of data are equal.
 * @param  data1 First array of data.
 * @param  data2 Second array of data.
 * @param  mode  Signal extension mode.
 * @return       True if both arrays of data are equal, otherwise false.
 */
function equalData(
  data1: number[],
  data2: number[],
  mode: PaddingMode,
): boolean {
  /* Minimally pad data. */
  if (data1.length % 2 !== 0) data1 = dwt.pad(data1, [0, 1], mode);
  if (data2.length % 2 !== 0) data2 = dwt.pad(data2, [0, 1], mode);

  /* Unequal lengths of data. */
  if (data1.length !== data2.length) {
    console.error(data1);
    console.error(data2);
    console.error('Data lengths ' + data1.length + ' and ' + data2.length + ' are not equal.');
    return false;
  }

  for (let i: number = 0; i < data1.length; i++) {
    /* Unequal data. */
    if (!closeTo(data1[i], data2[i])) {
      console.error('Values ' + data1[i] + ' and ' + data2[i] + ' are not equal.');
      return false;
    }
  }

  /* Equal data. */
  return true;
}

describe('dwt', () => {
  it('dwt exists', () => {
    expect(new dwt()).toBeInstanceOf(dwt);
  });

  describe('dwt', () => {
    it('throws an error if low-pass and high-pass decomposition filters have unequal length', () => {
      expect(() => {
        dwt.dwt(
          haarDatasets[0].data,
          {
            ...HAAR_WAVELET,
            dec: {
              ...HAAR_WAVELET.dec,
              high: [...HAAR_WAVELET.dec.high, -1, 1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have a length less than two', () => {
      expect(() => {
        dwt.dwt(
          haarDatasets[0].data,
          {
            ...HAAR_WAVELET,
            dec: {
              low: [1],
              high: [1],
            },
          },
        );
      }).toThrowError();
    });

    it('calculates a single level DWT', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(equalCoeffs(
              dwt.dwt(dataset.data, alias, dataset.mode),
              dataset.dwt
            )).toBe(true);
          }
        }
      }
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
        /* The energy may change for non-zero padding. */
        const zeroPaddingDatasets: Dataset[] = waveletDataset.datasets
            .filter(d => d.mode === 'zero');
        for (const dataset of zeroPaddingDatasets) {
          expect(
            dwt.energy(dataset.dwt)
          ).toBeCloseTo(dataset.energy, PRECISION);
          expect(
            dwt.energy(dataset.wavedec)
          ).toBeCloseTo(dataset.energy, PRECISION);
        }
      }
    });
  });

  describe('idwt', () => {
    it('throws an error if approximation and detail coefficients do not have equal length', () => {
      expect(() => {
        dwt.idwt(
          [1, 2],
          [3],
          'haar'
        );
      }).toThrowError();
    });

    it('throws an error if approximation and detail coefficients have zero length', () => {
      expect(() => {
        dwt.idwt([], [], 'haar');
      }).toThrowError();
    });

    it('throws an error if approximation and detail coefficients are undefined', () => {
      expect(() => {
        dwt.idwt(undefined, undefined, 'haar');
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have unequal length', () => {
      expect(() => {
        dwt.idwt(
          haarDatasets[0].dwt[0],
          haarDatasets[0].dwt[1],
          {
            ...HAAR_WAVELET,
            rec: {
              ...HAAR_WAVELET.dec,
              high: [...HAAR_WAVELET.dec.high, 1, -1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have a length less than two', () => {
      expect(() => {
        dwt.idwt(
          haarDatasets[0].dwt[0],
          haarDatasets[0].dwt[1],
          {
            ...HAAR_WAVELET,
            rec: {
              low: [1],
              high: [1],
            },
          },
        );
      }).toThrowError();
    });

    it('fills undefined coefficient arrays with zero', () => {
      const coeffs: number[] = [1, -2, 7, 1];

      expect(equalData(
        dwt.idwt(coeffs, undefined, 'haar'),
        dwt.idwt(coeffs, createArray(coeffs.length, 0), 'haar'),
        'zero'
      ));

      expect(equalData(
        dwt.idwt(undefined, coeffs, 'db2'),
        dwt.idwt(createArray(coeffs.length, 0), coeffs, 'db2'),
        'zero'
      ));
    });

    it('calculates an inverse single level DWT', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(equalData(
              dwt.idwt(dataset.dwt[0], dataset.dwt[1], alias),
              dataset.data,
              dataset.mode
            )).toBe(true);
          }
        }
      }
    });
  });

  describe('maxLevel', () => {
    it('throws an error for non-integer length', () => {
      expect(() => {
        dwt.maxLevel(3.14, 'haar');
      }).toThrowError();
    })

    it('throws an error for data with length less than zero', () => {
      expect(() => {
        dwt.maxLevel(-1, 'haar');
      }).toThrowError();
    })

    it('returns zero for data with length less than two', () => {
      expect(dwt.maxLevel(0, 'haar')).toBe(0);
      expect(dwt.maxLevel(1, 'haar')).toBe(0);
    });

    it('determines the maximum level correctly', () => {
      expect(dwt.maxLevel(2, 'haar')).toBe(1);
      expect(dwt.maxLevel(4, 'haar')).toBe(2);
      expect(dwt.maxLevel(1024, 'haar')).toBe(10);

      expect(dwt.maxLevel(5, 'db2')).toBe(0);
      expect(dwt.maxLevel(12, 'db2')).toBe(2);

      expect(dwt.maxLevel(35, 'db5')).toBe(1);
      expect(dwt.maxLevel(36, 'db5')).toBe(2);
    });
  });

  describe('pad', () => {
    it('throws an error for negative padding widths', () => {
      expect(() => {
        dwt.pad(
          [1, 2, 3],
          [-1, 0],
          'zero'
        );
      }).toThrowError();

      expect(() => {
        dwt.pad(
          [1, 2, 3],
          [0, -1],
          'zero'
        );
      }).toThrowError();
    });

    it('throws an error for unknown padding modes', () => {
      expect(() => {
        dwt.pad([1, 2, 3], [1, 1], 'foobar' as PaddingMode);
      }).toThrowError();
    });

    it('throws an error when trying to add antisymmetric padding for data of zero length', () => {
      expect(() => {
        dwt.pad([], [3, 3], 'antisymmetric');
      }).toThrowError();
    });

    it('adds antisymmetric padding', () => {
      expect(dwt.pad([4, -6, 0], [7, 3], 'antisymmetric'))
          .toEqual([
            -4, 4, -6, 0, -0, 6, -4,
            4, -6, 0,
            -0, 6, -4
          ]);
      
      expect(dwt.pad([4], [3, 2], 'antisymmetric'))
          .toEqual([
            -4, 4, -4,
            4,
            -4, 4
          ]);
    });

    it('throws an error when trying to add constant padding for data of zero length', () => {
      expect(() => {
        dwt.pad([], [1, 2], 'constant');
      }).toThrowError();
    });

    it('adds constant padding', () => {
      expect(dwt.pad([1, 2, 3], [2, 3], 'constant'))
          .toEqual([
            1, 1,
            1, 2, 3,
            3, 3, 3
          ]);
      
      expect(dwt.pad([7], [4, 1], 'constant'))
          .toEqual([
            7, 7, 7, 7,
            7,
            7
          ]);
    });

    it('throws an error when trying to add periodic padding for data of zero length', () => {
      expect(() => {
        dwt.pad([], [2, 2], 'periodic');
      }).toThrowError();
    });

    it('adds periodic padding', () => {
      expect(dwt.pad([1, 2, 5], [4, 5], 'periodic'))
          .toEqual([
            5, 1, 2, 5,
            1, 2, 5,
            1, 2, 5, 1, 2
          ]);
    });

    it('throws an error when trying to add reflect padding for data of zero length', () => {
      expect(() => {
        dwt.pad([], [3, 1], 'reflect')
      }).toThrowError();
    });

    it('adds reflect padding', () => {
      expect(dwt.pad([2, 7, 1], [6, 5], 'reflect'))
          .toEqual([
            1, 7, 2, 7, 1, 7,
            2, 7, 1,
            7, 2, 7, 1, 7
          ]);

      expect(dwt.pad([1], [2, 2], 'reflect'))
          .toEqual([
            1, 1,
            1,
            1, 1
          ]);
    });

    it('throws an error when trying to add smooth padding for data of zero length', () => {
      expect(() => {
        dwt.pad([], [2, 1], 'smooth');
      }).toThrowError();
    });

    it('adds smooth padding', () => {
      expect(dwt.pad([1, 2, 3], [3, 2], 'smooth'))
          .toEqual([
            -2, -1, 0,
            1, 2, 3,
            4, 5
          ]);

      expect(dwt.pad([1], [1, 3], 'smooth'))
          .toEqual([
            2,
            1,
            0, -1, -2
          ]);
    });

    it('throws an error when trying to add symmetric padding for data of zero length', () => {
      expect(() => {
        dwt.pad([], [1, 1], 'symmetric');
      }).toThrowError();
    });

    it('adds symmetric padding', () => {
      expect(dwt.pad([3, 1, 4], [4, 7], 'symmetric'))
          .toEqual([
            4, 4, 1, 3,
            3, 1, 4,
            4, 1, 3, 3, 1, 4, 4
          ]);

      expect(dwt.pad([2], [3, 1], 'symmetric'))
          .toEqual([
            2, 2, 2,
            2,
            2
          ]);
    });

    it('adds zero padding', () => {
      expect(dwt.pad([42, 51], [2, 1], 'zero'))
          .toEqual([
            0, 0,
            42, 51,
            0
          ]);

      expect(dwt.pad([], [1, 2], 'zero'))
          .toEqual([
            0,
            0, 0
          ]);
    });
  });

  describe('wavedec', () => {
    it('throws an error if low-pass and high-pass decomposition filters have unequal length', () => {
      expect(() => {
        dwt.wavedec(
          haarDatasets[1].data,
          {
            ...HAAR_WAVELET,
            dec: {
              ...HAAR_WAVELET.dec,
              high: [...HAAR_WAVELET.dec.high, 1, -1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass decomposition filters have a length less than two', () => {
      expect(() => {
        dwt.wavedec(
          haarDatasets[1].data,
          {
            ...HAAR_WAVELET,
            dec: {
              low: [1],
              high: [1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if the decomposition level is less than zero', () => {
      expect(() => {
        dwt.wavedec(
          haarDatasets[0].data,
          'haar',
          haarDatasets[0].mode,
          -1,
        );
      }).toThrowError();
    });

    it('calculates the DWT', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(equalCoeffs(
              dwt.wavedec(dataset.data, alias, dataset.mode),
              dataset.wavedec
            )).toBe(true);
          }
        }
      }
    });

    it('calculates the DWT to the specified level', () => {
      expect(equalCoeffs(
        dwt.wavedec([1, 2, 3, 4], 'haar', undefined, 0),
        [[1, 2, 3, 4]]
      )).toBe(true);

      expect(equalCoeffs(
        dwt.wavedec([Math.SQRT2], 'haar', 'zero', 2),
        [[1 / Math.SQRT2], [1 / Math.SQRT2], [1]]
      )).toBe(true);
    });
  });

  describe('waverec', () => {
    it('throws an error if the coefficients have zero length', () => {
      expect(() => {
        dwt.waverec([], 'haar');
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have unequal length', () => {
      expect(() => {
        dwt.waverec(
          haarDatasets[1].wavedec,
          {
            ...HAAR_WAVELET,
            rec: {
              ...HAAR_WAVELET.dec,
              high: [...HAAR_WAVELET.dec.high, 1, -1],
            },
          },
        );
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have a length less than two', () => {
      expect(() => {
        dwt.waverec(
          haarDatasets[1].wavedec,
          {
            ...HAAR_WAVELET,
            rec: {
              low: [1],
              high: [1],
            },
          },
        );
      }).toThrowError();
    });

    it('calculates the inverse DWT', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(equalData(
              dwt.waverec(dataset.wavedec, alias),
              dataset.data,
              dataset.mode
            )).toBe(true);
          }
        }
      }
    });
  });
});
