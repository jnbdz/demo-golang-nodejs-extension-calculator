const calculator = require('../calculator');

test('subtract 2 - 2 to equal 0', () => {
    expect(calculator.subtract(2, 2)).toBe(0);
});