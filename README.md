# Discrete Wavelets

[Discrete wavelet transform (DWT)](https://en.wikipedia.org/wiki/Discrete_wavelet_transform) library.

## Importing this library

### Node Modules

- Run `npm install discrete-wavelets --save`
- Add an import to the npm package `import DWT from 'discrete-wavelets';`
- Then you can use the library in your code.

### UNPKG

- Put the following script tag `<script src='https://unpkg.com/discrete-wavelets@1.0.0/dist/discrete-wavelets.umd.js'></script>` in the head of your index.html
- Then you can use the library in your code.

## API

The library offers the following functions:

- [energy](#energy): Calculates the energy as sum of squares of an array of data or coefficients.
- [invTransform](#invTransform): Inverses a transform by calculating input data from coefficients.
- [transform](#transform): Transforms data by calculating coefficients from input data.

Only the following `Wavelet` is supported at the moment:

- [Haar](https://de.wikipedia.org/wiki/Haar-Wavelet): `D2`, `db1`, `haar`

### energy

Calculates the energy as sum of squares of an array of data or coefficients.

#### Argument

- `values` (`number[] | number[][]`): Array of data or coefficients.

#### Return

`energy` (`number`): Energy of values as the sum of squares.

#### Examples

```javascript
console.log(
  DWT.energy([-1, 2, 6, 1])
);
// expected output: 42

console.log(
  DWT.energy([[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]])
);
// expected output: 30
```

### invTransform

Inverses a transform by calculating input data from coefficients.

#### Arguments

- `coeffs` (`number[][]`): Coefficients as result of a transform.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`data` (`number[]`): Input data as result of the inverse transform.

#### Example

```javascript
var data = DWT.invTransform(
  [[5], [-2], [-1 / Math.SQRT2, -1 / Math.SQRT2]],
  'haar'
);

console.log(data);
// expected output: Array [0.9999999999999999, 1.9999999999999996, 2.999999999999999, 3.999999999999999]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[1, 2, 3, 4]`*

### transform

Transforms data by calculating coefficients from input data.

#### Arguments

- `data` (`number[]`): Input data with a length of a power of two.
- `wavelet` (`Wavelet`): Wavelet to use.

#### Return

`coeffs` (`number[][]`): Coefficients as result of the transform.

#### Example

```javascript
var coeffs = DWT.transform([1, 2, 3, 4], 'haar');

console.log(coeffs);
// expected output: Array [4.999999999999999, -1.9999999999999993, -0.7071067811865475, -0.7071067811865475]
```

*Be aware that due to floating point imprecision the result diverges slightly from the analytical solution `[5, -2, -0.7071067811865475, -0.7071067811865475]`*

## NPM scripts

- `npm install`: Install dependencies
- `npm test`: Run test suite
- `npm start`: Run `npm run build` in watch mode
- `npm run test:watch`: Run test suite in [interactive watch mode](http://facebook.github.io/jest/docs/cli.html#watch)
- `npm run test:prod`: Run linting and generate coverage
- `npm run build`: Generate bundles and typings, create docs
- `npm run lint`: Lints code
