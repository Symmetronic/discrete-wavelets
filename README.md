# Discrete Wavelets

[Discrete wavelet transform (DWT)](https://en.wikipedia.org/wiki/Discrete_wavelet_transform) library.

## Importing this library

### Node Modules

- Run `npm install discrete-wavelets --save`
- Add an import to the npm package `import dwt from 'discrete-wavelets';`
- Then you can use the library in your code.

### UNPKG

- Put the following script tag `<script src='https://unpkg.com/discrete-wavelets@4.0.0/dist/discrete-wavelets.umd.js'></script>` in the head of your index.html
- Then you can use the library in your code.

## Example usage

An exemplary application with code using this library can be found at [https://symmetronic.github.io/covid-19-dwt-analysis/](https://symmetronic.github.io/covid-19-dwt-analysis/)

## API

The library offers the following functions:

- [dwt](#dwt): Single level discrete wavelet transform.
- [energy](#energy): Calculates the energy as sum of squares of an array of data or coefficients.
- [idwt](#idwt): Single level inverse discrete wavelet transform.
- [wavedec](#wavedec): 1D wavelet decomposition. Transforms data by calculating coefficients from input data.
- [waverec](#waverec): 1D wavelet reconstruction. Inverses a transform by calculating input data from coefficients.

Only the following `Wavelet` is supported at the moment:

- [Haar](https://de.wikipedia.org/wiki/Haar-Wavelet): `'D2'`, `'db1'`, `'haar'`

### dwt

Single level discrete wavelet transform.

#### Arguments

- `data` (`number[]`): Input data with a length equal to a power of two. If your data does not have a length equal to a power of two by default, some possibilities to adjust this are described below.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`coeffs` (`number[][]`): Approximation and detail coefficients as result of the transform.

#### Example

```javascript
var coeffs = dwt.dwt([1, 2, 3, 4], 'haar');

console.log(coeffs);
// expected output: Array [[2.1213203435596425, 4.9497474683058326], [-0.7071067811865475, -0.7071067811865475]]
```

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

### idwt

Single level inverse discrete wavelet transform.

#### Arguments

- `approx` (`number[]`): Approximation coefficients.
- `detail` (`number[]`): Detail coefficients.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`rec` (`number[]`): Approximation coefficients of previous level of transform.

#### Example

```javascript
var rec = dwt.idwt(
  [(1 + 2) / Math.SQRT2, (3 + 4) / Math.SQRT2],
  [(1 - 2) / Math.SQRT2, (3 - 4) / Math.SQRT2],
);

console.log(rec);
// expected output: Array [0.9999999999999999, 1.9999999999999996, 2.9999999999999996, 3.9999999999999996]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[1, 2, 3, 4]`*

### wavedec

1D wavelet decomposition. Transforms data by calculating coefficients from input data.

#### Arguments

- `data` (`number[]`): Input data with a length equal to a power of two. If your data does not have a length equal to a power of two by default, some possibilities to adjust this are described below.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`coeffs` (`number[][]`): Coefficients as result of the transform.

#### Examples

A simple example where the data already has a length equal to a power of two:

```javascript
var coeffs = dwt.wavedec([1, 2, 3, 4], 'haar');

console.log(coeffs);
// expected output: Array [[4.999999999999999], [-1.9999999999999993], [-0.7071067811865475, -0.7071067811865475]]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[[5], [-2], [-0.7071067811865475, -0.7071067811865475]]`*

If your data does not have a length equal to a power of two, you basically have the following options to adjust this:

1) Interpolate data between your values in equidistant steps.
2) [Extending values at the border](https://www.mathworks.com/help/wavelet/ug/dealing-with-border-distortion.html) of your data.
3) Removing part of your data.

The interpolation is elaborated in more detail in the following example using the external libraries [exact-linspace](https://github.com/Symmetronic/exact-linspace) for creating evenly spaced values and [interp1](https://github.com/Symmetronic/interp1) for 1-dimensional data interpolation:

```javascript
import dwt from 'discrete-wavelets';
import linspace from 'exact-linspace';
import interp1 from 'interp1';

/* Exemplary input data that does not have a length equal to a power of two. */
var xs = [1,  2,  5, 7, 8, 9];
var ys = [0, -4, -2, 5, 3, 7];

/* Calculates previous power of two for the length of input data. */
var nrOfSamples = Math.pow(2, Math.floor(Math.log2(xs.length)));

/* Evenly sample x values. */
var newXs = linspace(
  Math.min(...xs),
  Math.max(...xs),
  nrOfSamples
);

/* Linearly interpolate y values. */
var newYs = interp1(xs, ys, newXs, 'linear');

/* As the interpolated y values have a length equal to a power of two,
 * wavelet coefficients can be calculated.
 */
var coeffs = dwt.wavedec(newYs, 'haar');
```

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

## Related project

- [Symmetronic Scaleogram](https://github.com/Symmetronic/strc-scaleogram) is a web component that allows to easily create a [scaleogram visualization](https://en.wikipedia.org/wiki/Spectrogram) from wavelet coefficients.

## NPM scripts

- `npm install`: Install dependencies
- `npm test`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
