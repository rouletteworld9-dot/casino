const { validateBet, VALID_BET_TYPES } = require("./betValidator");

function generateWinningNumber(gameState) {
  if (gameState.nextWinningNumber !== null) {
    return gameState.nextWinningNumber;
  }

  if (gameState.bets.length === 0) {
    return Math.floor(Math.random() * 37);
  }

  // Count total bet amounts per number to pick least bet number
  const numberBetAmounts = {};

  gameState.bets.forEach((bet) => {
    bet.numbers.forEach((num) => {
      numberBetAmounts[num] = (numberBetAmounts[num] || 0) + bet.amount;
    });
  });

  let minAmount = Infinity;
  let winningNumber = Math.floor(Math.random() * 37);

  for (const [num, amount] of Object.entries(numberBetAmounts)) {
    if (amount < minAmount) {
      minAmount = amount;
      winningNumber = parseInt(num, 10);
    }
  }

  return winningNumber;
}

function updateLastResults(currentResults, winningNumber, roundId, bets = []) {
  // Find the winning bet to get user details and amounts
  let winningBet = null;
  let betAmount = 0;
  let winningAmount = 0;

  if (bets && bets.length > 0) {
    // Find the first winning bet (there could be multiple winners)
    for (const bet of bets) {
      // Use proper bet validation to check if this bet is a winner
      if (validateBet(bet, winningNumber)) {
        winningBet = bet;
        betAmount = bet.amount;
        // Calculate winning amount using proper payout ratios
        winningAmount =
          bet.amount * VALID_BET_TYPES[bet.type].payout + bet.amount;
        break;
      }
    }
  }

  const newResult = {
    result: winningNumber,
    roundId,
    timestamp: Date.now(),
    userId: winningBet ? winningBet.userId : null,
    betAmount: betAmount,
    winningAmount: winningAmount,
  };

  return [newResult, ...currentResults.slice(0, 9)];
}

module.exports = {
  generateWinningNumber,
  updateLastResults,
};
