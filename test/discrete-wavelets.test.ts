import DWT from "../src/discrete-wavelets"

describe('DWT', () => {
  it('DWT exists', () => {
    expect(new DWT()).toBeInstanceOf(DWT);
  });
});
