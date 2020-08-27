import {
  waveletFromScalingNumbers,
} from "../src/helpers";
import {
  PaddingMode,
} from "../src/padding/padding";
import {
  Db2Wavelet,
  Db3Wavelet,
  Db4Wavelet,
  HaarWavelet,
  WaveletBasis,
  WaveletType,
} from "../src/wavelets/wavelets";

/**
 * Dataset for checking the correctness of the wavelet transform.
 */
export interface Dataset {

  /**
   * Input data values.
   */
  data: number[];

  /**
   * Single level DWT coefficients.
   */
  dwt: number[][];

  /**
   * Energy of data.
   */
  energy: number;

  /**
   * Signal extension mode.
   */
  mode: PaddingMode;

  /**
   * Wavelet decomposition coefficients.
   */
  wavedec: number[][];
}

/*
 * Datasets for Haar transform.
 */
const haarDataset1: Dataset = {
  data: [Math.SQRT2],
  dwt: [[2], [0]],
  energy: 2,
  mode: 'constant',
  wavedec: [[Math.SQRT2]],
};

const haarDataset2: Dataset = {
  data: [1, 2, 3, 4],
  dwt: [
    [3 / Math.SQRT2, 7 / Math.SQRT2],
    [-1 / Math.SQRT2, -1 / Math.SQRT2]
  ],
  energy: 30,
  mode: 'zero',
  wavedec: [
    [5],
    [-2],
    [-1 / Math.SQRT2, -1 / Math.SQRT2]
  ],
};

const haarDataset3: Dataset = {
  data: [0, 1, 2, 3, 5],
  dwt: [
    [1 / Math.SQRT2, 5 / Math.SQRT2, 5 / Math.SQRT2],
    [-1 / Math.SQRT2, - 1 / Math.SQRT2, 5 / Math.SQRT2]
  ],
  energy: 39,
  mode: 'zero',
  wavedec: [
    [3, 2.5],
    [-2, 2.5],
    [
      -1 / Math.SQRT2, -1 / Math.SQRT2, 5 / Math.SQRT2
    ]
  ],
};

const haarDataset4: Dataset = {
  data: [3, 7, 1, 1, -2, 5, 4, 6],
  dwt: [
    [ 7.07106781, 1.41421356, 2.12132034, 7.07106781],
    [-2.82842712, 0, -4.94974747, -1.41421356]
  ],
  energy: 141,
  mode: 'symmetric',
  wavedec: [
    [8.83883476],
    [-0.35355339],
    [4., -3.5],
    [-2.82842712, 0, -4.94974747, -1.41421356]
  ],
};

export const haarDatasets: Dataset[] = [
  haarDataset1,
  haarDataset2,
  haarDataset3,
  haarDataset4,
];

/*
 * Datasets for Daubechies 2 transform.
 */
const db2Dataset1: Dataset = {
  data: [Math.SQRT2],
  dwt: [
    [0.3169873, 0.6830127],
    [1.1830127, -0.1830127]
  ],
  energy: 2,
  mode: 'zero',
  wavedec: [[Math.SQRT2]],
};

const db2Dataset2: Dataset = {
  data: [3, 7, 1, 1, -2, 5, 4, 6],
  dwt: [
    [5.65685425, 7.39923721, 0.22414387, 3.33677403, 7.77817459],
    [-2.44948974, -1.60368225, -4.44140056, -0.41361256, 1.22474487]
  ],
  energy: 141,
  mode: 'symmetric',
  wavedec: [
    [5.65685425, 7.39923721, 0.22414387, 3.33677403, 7.77817459],
    [-2.44948974, -1.60368225, -4.44140056, -0.41361256, 1.22474487]
  ],
};

export const db2Datasets: Dataset[] = [
  db2Dataset1,
  db2Dataset2,
];

/*
 * Datasets for Daubechies 3 transform.
 */
const db3Dataset1: Dataset = {
  data: [8, 7, -4, 0],
  dwt: [
    [-0.43694615,  3.07570797,  6.47009498, -1.33068221],
    [4.1264382, -7.52679671,  1.41994333, -0.14090517]
  ],
  energy: 129,
  mode: 'zero',
  wavedec: [[8, 7, -4, 0]]
};

const db3Dataset2: Dataset = {
  data: [6, -2, 4, 7, 0, 3, -11, 1, 0, 8],
  dwt: [
    [
      44.49227683, 21.5493393,  1.38235204,  7.54897002, -2.49117868,
      -4.45420211,  9.24783854
    ],
    [
      -8.88178420e-16,  2.97971731e+00, -4.71672305e+00, -9.84911558e+00,
      -1.37979688e+00,  9.45102924e-01, -8.88178420e-16
    ]
  ],
  energy: 300,
  mode: 'smooth',
  wavedec: [
    [
      44.49227683, 21.5493393,  1.38235204,  7.54897002, -2.49117868,
      -4.45420211,  9.24783854
    ],
    [
      -8.88178420e-16,  2.97971731e+00, -4.71672305e+00, -9.84911558e+00,
      -1.37979688e+00,  9.45102924e-01, -8.88178420e-16
    ]
  ],
};

export const db3Datasets: Dataset[] = [
  db3Dataset1,
  db3Dataset2,
];

/*
 * Datasets for Daubechies 3 transform.
 */
const db4Dataset1: Dataset = {
  data: [0, 82,  -13, 7, 1, -1, -3, 0, -4, 6, 4, 17, 4, 34],
  dwt: [
    [
      3.12047329, -3.23448292, 56.01866076, 49.90355719,  3.03386694,
      -1.49254731, -3.8351745 ,  5.66721111, 14.49008974, 26.57947064
    ],
    [
      -68.85465438, -47.94273497,   9.67106184,  -3.32974395, -4.40631014,
      -4.80062461, -14.77973195, -19.47086887, -3.47864041,  -4.61406064
    ]
  ],
  energy: 8482,
  mode: 'reflect',
  wavedec: [
    [
      3.12047329, -3.23448292, 56.01866076, 49.90355719,  3.03386694,
      -1.49254731, -3.8351745 ,  5.66721111, 14.49008974, 26.57947064
    ],
    [
      -68.85465438, -47.94273497,   9.67106184,  -3.32974395, -4.40631014,
      -4.80062461, -14.77973195, -19.47086887, -3.47864041,  -4.61406064
    ]
  ],
};

export const db4Datasets: Dataset[] = [
  db4Dataset1,
];

/*
 * Mapping of wavelet aliases, datasets and wavelets.
 */
export const waveletDatasets: {
  aliases: WaveletType[],
  datasets: Dataset[],
  wavelet: WaveletBasis,
}[] = [
  {
    aliases: ['db1', 'D2', 'haar'],
    datasets: haarDatasets,
    wavelet: waveletFromScalingNumbers(HaarWavelet),
  },
  {
    aliases: ['db2', 'D4'],
    datasets: db2Datasets,
    wavelet: waveletFromScalingNumbers(Db2Wavelet),
  },
  {
    aliases: ['db3', 'D6'],
    datasets: db3Datasets,
    wavelet: waveletFromScalingNumbers(Db3Wavelet),
  },
  {
    aliases: ['db4', 'D8'],
    datasets: db4Datasets,
    wavelet: waveletFromScalingNumbers(Db4Wavelet),
  },
];
