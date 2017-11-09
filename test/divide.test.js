const calculator = require('../calculator');

test('divide 2 / 2 to equal 1', () => {
    expect(calculator.divide(2, 2)).toBe(1);
});