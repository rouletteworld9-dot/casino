const RED_NUMBERS = [
  1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36,
];

const BLACK_NUMBERS = [
  2, 4, 6, 8, 10, 11, 13, 15, 17, 20, 22, 24, 26, 28, 29, 31, 33, 35,
];

const VALID_BET_TYPES = {
  straight: { payout: 35 },
  split: { payout: 17 },
  street: { payout: 11 },
  corner: { payout: 8 },
  line: { payout: 5 },
  column: { payout: 2 },
  dozen: { payout: 2 },
  red: { payout: 1 },
  black: { payout: 1 },
  odd: { payout: 1 },
  even: { payout: 1 },
  low: { payout: 1 },
  high: { payout: 1 },
};

const COLUMN_MAPPINGS = {
  1: [1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34],
  2: [2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35],
  3: [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36],
};

function validateBet(bet, winningNumber) {
  if (!bet || typeof winningNumber !== 'number') return false;

  switch (bet.type) {
    case "straight":
    case "split":
    case "street":
    case "corner":
    case "line":
      return bet.numbers?.includes(winningNumber) || false;

    case "column":
      { const columnNum = bet.numbers?.[0];
      return COLUMN_MAPPINGS[columnNum]?.includes(winningNumber) || false; }

    case "dozen":
      { const dozenNum = bet.numbers?.[0];
      if (dozenNum === 1) return winningNumber >= 1 && winningNumber <= 12;
      if (dozenNum === 2) return winningNumber >= 13 && winningNumber <= 24;
      if (dozenNum === 3) return winningNumber >= 25 && winningNumber <= 36;
      return false; }

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

function validateBetData(bet) {
  if (!bet || typeof bet !== 'object') {
    return { isValid: false, error: "Invalid bet object" };
  }

  if (!bet.type || !VALID_BET_TYPES[bet.type]) {
    return { isValid: false, error: "Invalid bet type" };
  }

  if (!bet.amount || bet.amount <= 0) {
    return { isValid: false, error: "Invalid bet amount" };
  }

  const numbersRequired = ["straight", "split", "street", "corner", "line", "column", "dozen"];
  if (numbersRequired.includes(bet.type)) {
    if (!bet.numbers?.length) {
      return { isValid: false, error: "Numbers required for this bet type" };
    }

    for (const num of bet.numbers) {
      if (typeof num !== 'number' || num < 0 || num > 36) {
        return { isValid: false, error: "Invalid number in bet" };
      }
    }
  }

  return { isValid: true };
}

function validateMultipleBets(bets) {
  if (!Array.isArray(bets) || bets.length === 0) {
    return { isValid: false, errors: ["Invalid bets array"] };
  }

  if (bets.length > 20) {
    return { isValid: false, errors: ["Too many bets (max 20)"] };
  }

  const errors = [];
  bets.forEach((bet, index) => {
    const validation = validateBetData(bet);
    if (!validation.isValid) {
      errors.push(`Bet ${index + 1}: ${validation.error}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

module.exports = {
  VALID_BET_TYPES,
  RED_NUMBERS,
  BLACK_NUMBERS,
  validateBet,
  validateBetData,
  validateMultipleBets,
};