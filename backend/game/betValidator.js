// European roulette configuration
const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];
const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

const VALID_BET_TYPES = {
  straight: { payout: 35 }, // single number
  split: { payout: 17 }, // 2 numbers
  street: { payout: 11 }, // 3 numbers (row)
  corner: { payout: 8 }, // 4 numbers (square)
  line: { payout: 5 }, // 6 numbers (double street)

  column: { payout: 2 }, // 12 numbers (vertical column)
  dozen: { payout: 2 }, // 1–12 / 13–24 / 25–36
  red: { payout: 1 },
  black: { payout: 1 },
  odd: { payout: 1 },
  even: { payout: 1 },
  low: { payout: 1 }, // 1–18
  high: { payout: 1 }, // 19–36
};

/**
 * Validate bet win
 * @param {Object} bet { type, numbers[], amount }
 * @param {Number} winningNumber
 */
function validateBet(bet, winningNumber) {
  switch (bet.type) {
    case "straight":
      return bet.numbers.includes(winningNumber);

    case "split":
    case "street":
    case "corner":
    case "line":
      return bet.numbers.includes(winningNumber);

    case "column":
      if (bet.numbers[0] === 1)
        return [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34].includes(
          winningNumber
        );
      if (bet.numbers[0] === 2)
        return [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35].includes(
          winningNumber
        );
      if (bet.numbers[0] === 3)
        return [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36].includes(
          winningNumber
        );
      return false;

    case "dozen":
      if (bet.numbers[0] === 1)
        return winningNumber >= 1 && winningNumber <= 12;
      if (bet.numbers[0] === 2)
        return winningNumber >= 13 && winningNumber <= 24;
      if (bet.numbers[0] === 3)
        return winningNumber >= 25 && winningNumber <= 36;
      return false;

    case "red":
      return RED_NUMBERS.includes(winningNumber);
    case "black":
      return BLACK_NUMBERS.includes(winningNumber);

    case "odd":
      return winningNumber !== 0 && winningNumber % 2 === 1;
    case "even":
      return winningNumber !== 0 && winningNumber % 2 === 0;

    case "low":
      return winningNumber >= 1 && winningNumber <= 18;
    case "high":
      return winningNumber >= 19 && winningNumber <= 36;

    default:
      return false;
  }
}

module.exports = { VALID_BET_TYPES, validateBet };
