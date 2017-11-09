const calculator = require('../calculator');

test('multiply 2 * 2 to equal 4', () => {
    expect(calculator.multiply(2, 2)).toBe(4);
});