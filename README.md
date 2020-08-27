# Discrete Wavelets

[Discrete wavelet transform (DWT)](https://en.wikipedia.org/wiki/Discrete_wavelet_transform) library inspired by [PyWavelets](https://github.com/PyWavelets/pywt).

## Importing this library

### Node Modules

- Run `npm install discrete-wavelets --save`
- Add an import to the npm package `import dwt from 'discrete-wavelets';`
- Then you can use the library in your code.

### UNPKG

- Put the following script tag `<script src='https://unpkg.com/discrete-wavelets@4.0.0/dist/discrete-wavelets.umd.js'></script>` in the head of your index.html
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

### Wavelets

The following `Wavelet` types are supported at the moment:

Wavelet                                                           | Aliases
------------------------------------------------------------------|---------------------------
[Haar](https://de.wikipedia.org/wiki/Haar-Wavelet) / Daubechies 1 | `'haar'`, `'db1'`, `'D2'`
Daubechies 2                                                      | `'db2'`, `'D4'`
Daubechies 3                                                      | `'db3'`, `'D6'`
Daubechies 4                                                      | `'db4'`, `'D8'`

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
- `mode` (`PaddingMode`): Signal extension mode.

#### Return

`coeffs` (`number[][]`): Approximation and detail coefficients as result of the transform.

#### Example

```javascript
var coeffs = dwt.dwt([1, 2, 3, 4], 'haar');

console.log(coeffs);
// expected output: Array [[2.1213203435596425, 4.9497474683058326], [-0.7071067811865475, -0.7071067811865475]]
```

### wavedec

1D wavelet decomposition. Transforms data by calculating coefficients from input data.

#### Arguments

- `data` (`number[]`): Input data.
- `wavelet` (`Wavelet`): Wavelet to use.
- `mode` (`PaddingMode`): Signal extension mode.
- `level` (`number`): Decomposition level. Defaults to level calculated by [maxLevel](#maxLevel) function.

#### Return

`coeffs` (`number[][]`): Coefficients as result of the transform.

#### Example

```javascript
var coeffs = dwt.wavedec([1, 2, 3, 4], 'haar');

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
var rec = dwt.idwt(
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
var data = dwt.waverec(
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
  dwt.energy([-1, 2, 6, 1])
);
// expected output: 42

console.log(
  dwt.energy([[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]])
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
var maxLevel = dwt.maxLevel(4, 'haar');

console.log(maxLevel);
// expected output: 2
```

```javascript
var maxLevel = dwt.maxLevel(1024, 'haar');

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
var pad = dwt.pad([42, 51], [2, 1], 'zero');

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
