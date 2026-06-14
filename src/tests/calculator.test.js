const { compute } = require('../calculator');

describe('Calculator compute()', () => {
  test('addition: 2 + 3 = 5', () => {
    expect(compute('add', [2, 3])).toBe(5);
    expect(compute('+', [2, 3])).toBe(5);
  });

  test('subtraction: 10 - 4 = 6', () => {
    expect(compute('sub', [10, 4])).toBe(6);
    expect(compute('-', [10, 4])).toBe(6);
  });

  test('multiplication: 45 * 2 = 90', () => {
    expect(compute('mul', [45, 2])).toBe(90);
    expect(compute('*', [45, 2])).toBe(90);
  });

  test('division: 20 / 5 = 4', () => {
    expect(compute('div', [20, 5])).toBe(4);
    expect(compute('/', [20, 5])).toBe(4);
  });

  test('multiple operands: add 1 2 3 = 6', () => {
    expect(compute('add', [1, 2, 3])).toBe(6);
  });

  test('multiple operands: sub 10 3 2 = 5', () => {
    expect(compute('sub', [10, 3, 2])).toBe(5);
  });

  test('multiple operands: mul 3 4 5 = 60', () => {
    expect(compute('mul', [3, 4, 5])).toBe(60);
  });

  test('multiple operands: div 100 2 5 = 10', () => {
    expect(compute('div', [100, 2, 5])).toBe(10);
  });

  test('division by zero throws', () => {
    expect(() => compute('div', [10, 0])).toThrow('Division by zero');
    expect(() => compute('/', [10, 0])).toThrow('Division by zero');
    // also when zero appears later
    expect(() => compute('div', [100, 2, 0])).toThrow('Division by zero');
  });

  test('unknown operation throws', () => {
    expect(() => compute('pow', [2, 3])).toThrow('Unknown operation');
  });
});
