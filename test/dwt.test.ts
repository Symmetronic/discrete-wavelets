import {
  Dataset,
  haarDatasets,
  waveletDatasets,
} from './mocks';

import dwt from "../src/dwt"
import {
  padWidths,
} from '../src/helpers';
import {
  PaddingMode,
} from '../src/padding/padding';
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
 * @return       True if both arrays of data are equal, otherwise false.
 */
function equalData(data1: number[], data2: number[]): boolean {
  /* Unequal lengths of data. */
  if (data1.length !== data2.length) {
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
            ...HaarWavelet,
            dec: {
              ...HaarWavelet.dec,
              high: [...HaarWavelet.dec.high, -1, 1],
            },
          },
        );
      }).toThrowError();
    });

    it('calculates the Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalCoeffs(
          dwt.dwt(dataset.data, undefined, dataset.mode),
          dataset.dwt
        )).toBe(true);
      }
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
    it('throws an error if low-pass and high-pass reconstruction filters have unequal length', () => {
      expect(() => {
        dwt.idwt(
          haarDatasets[0].dwt[0],
          haarDatasets[0].dwt[1],
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

    it('throws an error if approximation and detail coefficients do not have equal length', () => {
      expect(() => {
        dwt.idwt(
          [1, 2],
          [3],
        );
      }).toThrowError();
    });


    it('calculates an inverse single level Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalData(
          dwt.idwt(dataset.dwt[0], dataset.dwt[1], undefined, dataset.mode),
          dwt.pad(
            dataset.data,
            padWidths(dataset.data.length, 2, dataset.mode),
            dataset.mode
          )
        )).toBe(true);
      }
    });

    it('calculates an inverse single level DWT', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(equalData(
              dwt.idwt(dataset.dwt[0], dataset.dwt[1], alias, dataset.mode),
              dwt.pad(
                dataset.data,
                padWidths(
                  dataset.data.length,
                  waveletDataset.wavelet.rec.low.length,
                  dataset.mode
                ),
                dataset.mode
              )
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

      // TODO: Check for other bases
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

    it('adds constant padding', () => {
      expect(dwt.pad([1, 2, 3], [2, 3], 'constant'))
          .toEqual([1, 1, 1, 2, 3, 3, 3, 3]);
    });

    it('adds zero padding', () => {
      expect(dwt.pad([42, 51], [2, 1], 'zero'))
          .toEqual([0, 0, 42, 51, 0]);
    });
  });

  describe('wavedec', () => {
    it('throws an error if low-pass and high-pass decomposition filters have unequal length', () => {
      expect(() => {
        dwt.wavedec(
          haarDatasets[1].data,
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

    it('calculates the Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalCoeffs(
          dwt.wavedec(dataset.data, undefined, dataset.mode),
          dataset.wavedec
        )).toBe(true);
      }
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
        dwt.wavedec([1, 2, 3, 4], undefined, undefined, 0),
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
        dwt.waverec([]);
      }).toThrowError();
    });

    it('throws an error if low-pass and high-pass reconstruction filters have unequal length', () => {
      expect(() => {
        dwt.waverec(
          haarDatasets[1].wavedec,
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

    it('calculates the inverse Haar DWT by default', () => {
      for (const dataset of haarDatasets) {
        expect(equalData(
          dwt.waverec(dataset.wavedec, undefined, dataset.mode),
          dwt.pad(
            dataset.data,
            padWidths(dataset.data.length, 2, dataset.mode),
            dataset.mode
          )
        )).toBe(true);
      }
    });

    it('calculates the inverse DWT', () => {
      for (const waveletDataset of waveletDatasets) {
        for (const alias of waveletDataset.aliases) {
          for (const dataset of waveletDataset.datasets) {
            expect(equalData(
              dwt.waverec(dataset.wavedec, alias, dataset.mode),
              dwt.pad(
                dataset.data,
                padWidths(
                  dataset.data.length,
                  waveletDataset.wavelet.rec.low.length,
                  dataset.mode
                ),
                dataset.mode
              )
            )).toBe(true);
          }
        }
      }
    });
  });
});
