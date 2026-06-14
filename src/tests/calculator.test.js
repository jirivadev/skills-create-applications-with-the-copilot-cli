const { compute, modulo, power, squareRoot } = require('../../src/calculator');

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

  test('power operation via compute: pow 2^3 = 8', () => {
    expect(compute('pow', [2, 3])).toBe(8);
    expect(compute('power', [2, 8])).toBe(256);
  });

  test('unknown operation throws', () => {
    expect(() => compute('unknown-op', [1, 2])).toThrow('Unknown operation');
  });
});

describe('Calculator helpers: modulo, power, squareRoot', () => {
  describe('modulo(a, b)', () => {
    test('10 % 3 -> 1', () => {
      expect(modulo(10, 3)).toBe(1);
    });

    test('10.5 % 3 -> 1.5 (JS float modulo)', () => {
      expect(modulo(10.5, 3)).toBeCloseTo(1.5);
    });

    test('modulo by zero throws Division by zero', () => {
      expect(() => modulo(10, 0)).toThrow('Division by zero');
    });
  });

  describe('power(base, exponent)', () => {
    test('2^8 -> 256', () => {
      expect(power(2, 8)).toBe(256);
    });

    test('2^0 -> 1', () => {
      expect(power(2, 0)).toBe(1);
    });

    test('(-2)^3 -> -8', () => {
      expect(power(-2, 3)).toBe(-8);
    });

    test('fractional exponent: 9^(0.5) -> 3', () => {
      expect(power(9, 0.5)).toBeCloseTo(3);
    });
  });

  describe('squareRoot(n)', () => {
    test('sqrt(9) -> 3', () => {
      expect(squareRoot(9)).toBe(3);
    });

    test('sqrt(2) approx 1.414', () => {
      expect(squareRoot(2)).toBeCloseTo(Math.SQRT2, 5);
    });

    test('sqrt(-1) throws Negative input', () => {
      expect(() => squareRoot(-1)).toThrow('Negative input');
    });
  });
});
