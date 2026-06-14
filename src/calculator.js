#!/usr/bin/env node
'use strict';

/**
 * CLI Calculator
 * Supports the following operations:
 *  - add (or +) : addition
 *  - sub (or -) : subtraction
 *  - mul (or *) : multiplication
 *  - div (or /) : division
 *
 * Usage examples:
 *   node src/calculator.js add 1 2 3    # => 6
 *   node src/calculator.js sub 5 2      # => 3
 *   node src/calculator.js mul 4 7      # => 28
 *   node src/calculator.js div 10 2     # => 5
 *
 * Behavior & requirements (per repository issue):
 *  - Accepts an operation and two or more numeric operands
 *  - Validates numeric input and exits with non-zero code on invalid input
 *  - Handles division by zero with a clear error and non-zero exit code
 *  - Provides a --help flag with usage
 */

function printHelp() {
  console.log(`Usage: node src/calculator.js <operation> <num1> <num2> [<num3> ...]

Operations:
  add, +       Addition
  sub, -       Subtraction
  mul, *       Multiplication
  div, /       Division
  modulo, %    Remainder (a % b)
  power, ^, pow Exponentiation (base ^ exponent)
  sqrt         Square root (unary)

Examples:
  node src/calculator.js add 1 2 3
  node src/calculator.js sub 5 2
  node src/calculator.js mul 4 7
  node src/calculator.js div 10 2
  node src/calculator.js modulo 10 3
  node src/calculator.js power 2 8
  node src/calculator.js sqrt 9

Notes:
  - sqrt is a unary operation (one operand).
  - power requires exactly two operands: base and exponent.

Exit codes:
  0 - success
  2 - invalid numeric input
  3 - division by zero
  4 - usage / argument errors
`);
}

// New helper functions
function modulo(a, b) {
  // JavaScript % works with floats; guard division by zero
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a % b;
}

function power(base, exponent) {
  return Math.pow(base, exponent);
}

function squareRoot(n) {
  if (n < 0) {
    throw new Error('Negative input');
  }
  return Math.sqrt(n);
}

function compute(operation, nums) {
  switch (operation) {
    case 'add':
    case '+':
      return nums.reduce((a, b) => a + b, 0);
    case 'sub':
    case '-':
      return nums.slice(1).reduce((a, b) => a - b, nums[0]);
    case 'mul':
    case '*':
      return nums.reduce((a, b) => a * b, 1);
    case 'div':
    case '/':
      // Check division by zero in any subsequent operand
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] === 0) {
          throw new Error('Division by zero');
        }
      }
      return nums.slice(1).reduce((a, b) => a / b, nums[0]);
    case 'modulo':
    case '%':
    case 'mod':
      // implement n-ary modulo: a % b % c ... (left-associative)
      for (let i = 1; i < nums.length; i++) {
        if (nums[i] === 0) {
          throw new Error('Division by zero');
        }
      }
      return nums.slice(1).reduce((a, b) => modulo(a, b), nums[0]);
    case 'power':
    case '^':
    case 'pow':
      if (nums.length !== 2) {
        throw new Error('Power requires exactly two operands');
      }
      return power(nums[0], nums[1]);
    case 'sqrt':
      if (nums.length < 1) {
        throw new Error('Square root requires one operand');
      }
      return squareRoot(nums[0]);
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// Export compute and new helpers for testing and reuse
module.exports = { compute, printHelp, modulo, power, squareRoot };

// CLI execution only when run directly
if (require.main === module) {
  const processArgs = process.argv.slice(2);

  if (processArgs.length === 0 || processArgs.includes('--help') || processArgs.includes('-h')) {
    printHelp();
    process.exit(processArgs.length === 0 ? 4 : 0);
  }

  const op = processArgs[0];
  const rawOperands = processArgs.slice(1);

  if (rawOperands.length < 2) {
    console.error('Error: at least two numeric operands are required.');
    printHelp();
    process.exit(4);
  }

  // Parse operands and validate
  const operands = rawOperands.map((s) => {
    const n = Number(s);
    return Number.isFinite(n) ? n : NaN;
  });

  if (operands.some(Number.isNaN)) {
    console.error('Error: all operands must be valid numbers.');
    process.exit(2);
  }

  // Validate operand counts based on operation
  const unaryOps = new Set(['sqrt']);
  const binaryOnlyOps = new Set(['power', '^', 'pow']);
  const requiresAtLeastTwo = new Set(['add', '+', 'sub', '-', 'mul', '*', 'div', '/', 'modulo', '%', 'mod']);

  if (unaryOps.has(op)) {
    if (operands.length < 1) {
      console.error('Error: this operation requires one numeric operand.');
      printHelp();
      process.exit(4);
    }
  } else if (binaryOnlyOps.has(op)) {
    if (operands.length !== 2) {
      console.error('Error: this operation requires exactly two numeric operands.');
      printHelp();
      process.exit(4);
    }
  } else if (requiresAtLeastTwo.has(op)) {
    if (operands.length < 2) {
      console.error('Error: at least two numeric operands are required for this operation.');
      printHelp();
      process.exit(4);
    }
  }

  try {
    const result = compute(op, operands);
    // Print as-is; ensure integers show without trailing .0
    if (Number.isInteger(result)) {
      console.log(result);
    } else {
      console.log(result);
    }
    process.exit(0);
  } catch (err) {
    if (err.message === 'Division by zero') {
      console.error('Error: division by zero detected.');
      process.exit(3);
    }
    console.error('Error:', err.message);
    process.exit(4);
  }
}

