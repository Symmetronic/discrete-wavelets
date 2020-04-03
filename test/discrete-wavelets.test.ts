import DWT from "../src/discrete-wavelets"
import {
  WaveletType,
} from "../src/wavelets/wavelets";

/**
 * Dataset for checking the correctness of the wavelet transform.
 */
interface Dataset {

  /**
   * Coefficients.
   */
  coeffs: number[][];

  /**
   * Input data values.
   */
  data: number[];

  /**
   * Energy of data.
   */
  energy: number;
}

/*
 * Datasets for haar transform.
 */
const dataset1: Dataset = {
  data: [1, 2, 3, 4],
  coeffs: [[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]],
  energy: 30,
};

const dataset2: Dataset = {
  data: [0, 1, 2, 3, 5, 8, 13, 21],
  coeffs: [
    [18.73832970144351],
    [-14.495689014324228],
    [-2.0000000000000004, -10.500000000000004],
    [
      -0.7071067811865476, -0.7071067811865477,
      -2.121320343559643, -5.65685424949238
    ]
  ],
  energy: 713,
}

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
 * @param  coeffs1 Set of coefficients.
 * @param  coeffs2 Set of coefficients.
 * @return         True if both sets of coefficients are equal, otherwise false.
 */
function equalCoeffs(coeffs1: number[][], coeffs2: number[][]): boolean {
  for (let i: number = 0; i < coeffs1.length; i++) {
    for (let j: number = 0; j < coeffs1[i].length; j++) {
      if (!closeTo(coeffs1[i][j], coeffs2[i][j])) return false;
    }
  }
  return true;
}

describe('DWT', () => {

  it('DWT exists', () => {
    expect(new DWT()).toBeInstanceOf(DWT);
  });

  describe('coeffsToArray', () => {
    it('flattens an array of arrays', () => {
      expect(DWT.coeffsToArray([])).toEqual([]);
      expect(DWT.coeffsToArray([[]])).toEqual([]);
      expect(
        DWT.coeffsToArray([[5], [-2], [-0.707, -0.707]])
      ).toEqual([5, -2, -0.707, -0.707])
    });
  });

  describe('energy', () => {
    it('calculates energy for empty values', () => {
      expect(DWT.energy([])).toBe(0);
      expect(DWT.energy([[], [], []])).toBe(0);
    });

    it('calculates the energy of input data', () => {
      expect(DWT.energy([5])).toBe(25);
      expect(DWT.energy(dataset1.data)).toBeCloseTo(dataset1.energy, PRECISION);
      expect(DWT.energy(dataset2.data)).toBeCloseTo(dataset2.energy, PRECISION);
    });

    it('calculates the energy of coefficients', () => {
      expect(DWT.energy([[3]])).toBe(9);
      expect(
        DWT.energy(dataset1.coeffs)
      ).toBeCloseTo(dataset1.energy, PRECISION);
      expect(
        DWT.energy(dataset2.coeffs)
      ).toBeCloseTo(dataset2.energy, PRECISION);
    });
  });

  describe('invTransform', () => {
    // TODO: Add tests
  });

  describe('transform', () => {
    it('throws an error if the input has a length lower than 2', () => {
      expect(() => {
        DWT.transform([]);
      }).toThrowError();

      expect(() => {
        DWT.transform([2]);
      }).toThrowError();
    });

    it('throws an error if the input has a length other than a power of 2', () => {
      expect(() => {
        DWT.transform([4, 8, 16])
      }).toThrowError();

      expect(() => {
        DWT.transform([32, 64, 128, 256, 512])
      }).toThrowError();
    });

    it('calculates the Haar DWT by default', () => {
      expect(equalCoeffs(DWT.transform(dataset1.data), dataset1.coeffs));
      expect(equalCoeffs(DWT.transform(dataset2.data), dataset2.coeffs));
    });

    it('calculates the Haar DWT', () => {
      /* 'haar', 'db1' and 'D2' are all aliases for the Haar DWT. */
      const aliases: WaveletType[] = ['haar', 'db1', 'D2'];

      for (const alias of aliases) {
        expect(equalCoeffs(
          DWT.transform(dataset1.data, alias),
          dataset1.coeffs,
        ));
        expect(equalCoeffs(
          DWT.transform(dataset2.data, alias),
          dataset2.coeffs,
        ));
      }
    });
  });
});
