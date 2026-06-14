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
  add, +    Addition
  sub, -    Subtraction
  mul, *    Multiplication
  div, /    Division

Examples:
  node src/calculator.js add 1 2 3
  node src/calculator.js sub 5 2
  node src/calculator.js mul 4 7
  node src/calculator.js div 10 2

Exit codes:
  0 - success
  2 - invalid numeric input
  3 - division by zero
  4 - usage / argument errors
`);
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
    default:
      throw new Error(`Unknown operation: ${operation}`);
  }
}

// Export compute for testing and reuse
module.exports = { compute, printHelp };

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

