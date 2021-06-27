[![Build Status](https://github.com/Symmetronic/discrete-wavelets/workflows/build/badge.svg?branch=main)](https://github.com/Symmetronic/discrete-wavelets/actions?query=workflow%3Abuild+branch%3Amain) [![Coverage Status](https://coveralls.io/repos/github/Symmetronic/discrete-wavelets/badge.svg?branch=main)](https://coveralls.io/github/Symmetronic/discrete-wavelets?branch=main) [![GitHub License](https://img.shields.io/github/license/Symmetronic/discrete-wavelets)](https://github.com/Symmetronic/discrete-wavelets/blob/main/LICENSE) [![NPM Version](https://img.shields.io/npm/v/discrete-wavelets)](https://www.npmjs.com/package/discrete-wavelets) [![Monthly Downloads](https://img.shields.io/npm/dm/discrete-wavelets)](https://npmcharts.com/compare/discrete-wavelets?minimal=true)

# Discrete Wavelets

A [Discrete Wavelet Transform (DWT)](https://en.wikipedia.org/wiki/Discrete_wavelet_transform) library for the web.

This library is well tested. Still, it may contain some errors. Therefore it is recommended to double check the results with another library such as [PyWavelets](https://github.com/PyWavelets/pywt). If you find any errors, please let me know by opening an issue or a pull request.

## Importing this library

### Node Modules

- Run `npm install discrete-wavelets`
- Add an import to the npm package `import wt from 'discrete-wavelets';`
- Then you can use the library in your code.

### CDN

- Put the following script tag `<script src="https://cdn.jsdelivr.net/npm/discrete-wavelets@5/dist/discrete-wavelets.umd.min.js"></script>` in the head of your HTML file.
- Then you can use the library in your code.

## Types

The library uses the following types:

- [PaddingMode](#PaddingMode): Signal extension modes.
- [Wavelets](#Wavelets): Wavelet bases.

### PaddingMode

The following values for `PaddingMode` are supported at the moment:

Name                  | Value             | Description
----------------------|-------------------|------------------------------------
Zero Padding          | `'zero'`          | Adding zeros.
Constant Padding      | `'constant'`      | Replication of border values.
Symmetric Padding     | `'symmetric'`     | Mirroring of samples.
Reflect Padding       | `'reflect'`       | Reflecting of samples.
Periodic Padding      | `'periodic'`      | Treating signal as a periodic one.
Smooth Padding        | `'smooth'`        | Signal extended as a straight line.
Antisymmetric Padding | `'antisymmetric'` | Mirroring and negation of samples.

You can get a list of the supported signal extension modes:

```javascript
console.log(wt.Modes.modes);
// expected output: Array ['zero', 'constant', 'symmetric', 'periodic', 'smooth', 'reflect', 'antisymmetric']
```

### Wavelets

The following `Wavelet` types are supported at the moment:

Wavelet                                                           | Aliases
------------------------------------------------------------------|---------------------------
Daubechies 1 / [Haar](https://de.wikipedia.org/wiki/Haar-Wavelet) | `'db1'`, `'D2'`, `'haar'`
Daubechies 2                                                      | `'db2'`, `'D4'`
Daubechies 3                                                      | `'db3'`, `'D6'`
Daubechies 4                                                      | `'db4'`, `'D8'`
Daubechies 5                                                      | `'db5'`, `'D10'`
Daubechies 6                                                      | `'db6'`, `'D12'`
Daubechies 7                                                      | `'db7'`, `'D14'`
Daubechies 8                                                      | `'db8'`, `'D16'`
Daubechies 9                                                      | `'db9'`, `'D18'`
Daubechies 10                                                     | `'db10'`, `'D20'`

## API

The library offers the following functions:

- Discrete Wavelet Transform (DWT)
    - [dwt](#dwt): Single level Discrete Wavelet Transform.
    - [wavedec](#wavedec): 1D wavelet decomposition. Transforms data by calculating coefficients from input data.
- Inverse Discrete Wavelet Transform (IDWT)
    - [idwt](#idwt): Single level inverse Discrete Wavelet Transform.
    - [waverec](#waverec): 1D wavelet reconstruction. Inverses a transform by calculating input data from coefficients.
- Other
    - [energy](#energy): Calculates the energy as sum of squares of an array of data or coefficients.
    - [maxLevel](#maxLevel): Determines the maximum level of useful decomposition.
    - [pad](#pad): Extends a signal with a given padding mode.

### dwt

Single level Discrete Wavelet Transform.

#### Arguments

- `data` (`number[]`): Input data.
- `wavelet` (`Wavelet`): Wavelet to use.
- `mode` (`PaddingMode`): Signal extension mode. Defaults to `'symmetric'`.

#### Return

`coeffs` (`number[][]`): Approximation and detail coefficients as result of the transform.

#### Example

```javascript
var coeffs = wt.dwt([1, 2, 3, 4], 'haar');

console.log(coeffs);
// expected output: Array [[2.1213203435596425, 4.9497474683058326], [-0.7071067811865475, -0.7071067811865475]]
```

### wavedec

1D wavelet decomposition. Transforms data by calculating coefficients from input data.

#### Arguments

- `data` (`number[]`): Input data.
- `wavelet` (`Wavelet`): Wavelet to use.
- `mode` (`PaddingMode`): Signal extension mode. Defaults to `'symmetric'`.
- `level` (`number`): Decomposition level. Defaults to level calculated by [maxLevel](#maxLevel) function.

#### Return

`coeffs` (`number[][]`): Coefficients as result of the transform.

#### Example

```javascript
var coeffs = wt.wavedec([1, 2, 3, 4], 'haar');

console.log(coeffs);
// expected output: Array [[4.999999999999999], [-1.9999999999999993], [-0.7071067811865475, -0.7071067811865475]]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[[5], [-2], [-0.7071067811865475, -0.7071067811865475]]`*

### idwt

Single level inverse Discrete Wavelet Transform.

#### Arguments

- `approx` (`number[]`): Approximation coefficients. If `undefined`, it will be set to an array of zeros with length equal to the detail coefficients.
- `detail` (`number[]`): Detail coefficients. If `undefined`, it will be set to an array of zeros with length equal to the approximation coefficients.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`rec` (`number[]`): Approximation coefficients of previous level of transform.

#### Example

```javascript
var rec = wt.idwt(
  [(1 + 2) / Math.SQRT2, (3 + 4) / Math.SQRT2],
  [(1 - 2) / Math.SQRT2, (3 - 4) / Math.SQRT2],
  'haar'
);

console.log(rec);
// expected output: Array [0.9999999999999999, 1.9999999999999996, 2.9999999999999996, 3.9999999999999996]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[1, 2, 3, 4]`*

### waverec

1D wavelet reconstruction. Inverses a transform by calculating input data from coefficients.

#### Arguments

- `coeffs` (`number[][]`): Coefficients as result of a transform.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`data` (`number[]`): Input data as result of the inverse transform.

#### Example

```javascript
var data = wt.waverec(
  [[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]],
  'haar'
);

console.log(data);
// expected output: Array [0.9999999999999999, 1.9999999999999996, 2.999999999999999, 3.999999999999999]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[1, 2, 3, 4]`*

### energy

Calculates the energy as sum of squares of an array of data or coefficients.

#### Argument

- `values` (`number[] | number[][]`): Array of data or coefficients.

#### Return

`energy` (`number`): Energy of values as the sum of squares.

#### Examples

```javascript
console.log(
  wt.energy([-1, 2, 6, 1])
);
// expected output: 42

console.log(
  wt.energy([[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]])
);
// expected output: 30
```

### maxLevel

Determines the maximum level of useful decomposition.

#### Arguments

- `dataLength` (`number`): Length of input data.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`maxLevel` (`number`): Maximum useful level of decomposition.

#### Examples

```javascript
var maxLevel = wt.maxLevel(4, 'haar');

console.log(maxLevel);
// expected output: 2
```

```javascript
var maxLevel = wt.maxLevel(1024, 'haar');

console.log(maxLevel);
// expected output: 10
```

### pad

Extends a signal with a given padding mode.

#### Arguments

- `data` (`number[]`): Input data.
- `padWidths` (`[number, number]`): Widths of padding at front and back.
- `mode` (`PaddingMode`): Signal extension mode.

#### Return

`pad` (`number[]`): Data with padding.

#### Example

```javascript
var pad = wt.pad([42, 51], [2, 1], 'zero');

console.log(pad);
// expected output: Array [0, 0, 42, 51, 0]
```

## NPM scripts

- `npm install`: Install dependencies
- `npm test`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code

## This library in action

An exemplary application with code using this library can be found at [https://symmetronic.github.io/covid-19-dwt-analysis/](https://symmetronic.github.io/covid-19-dwt-analysis/)

## Related project

[Symmetronic Scaleogram](https://github.com/Symmetronic/strc-scaleogram) is a web component that allows to easily create a [scaleogram visualization](https://en.wikipedia.org/wiki/Spectrogram) from wavelet coefficients.

## Contributing

Pull requests are welcome! Please include new tests for your code and make sure that all tests succeed running `npm test`.
