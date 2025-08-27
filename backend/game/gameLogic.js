const {
  validateBet,
  VALID_BET_TYPES,
} = require("./betValidator");
const payouts = require('./payouts');


function generateWinningNumber(gameState) {
  if (gameState.nextWinningNumber !== null) {
    return gameState.nextWinningNumber;
  }

  if (gameState.bets.length === 0) {
    return Math.floor(Math.random() * 37);
  }

  // Calculate total payout for each possible number (0-36)
  const payoutForNumber = {};
  
  for (let number = 0; number <= 36; number++) {
    payoutForNumber[number] = 0;
    
    // Check each bet to see if this number wins
    for (const bet of gameState.bets) {
      if (validateBet(bet, number)) {
        payoutForNumber[number] += bet.amount * payouts[bet.type];
      }
    }
  }
  
  // Find number(s) with minimum total payout
  let minPayout = Math.min(...Object.values(payoutForNumber));
  let numbersWithMinPayout = Object.keys(payoutForNumber)
    .filter(num => payoutForNumber[num] === minPayout)
    .map(num => parseInt(num));
  
  // Randomly select from numbers that minimize payout
  return numbersWithMinPayout[Math.floor(Math.random() * numbersWithMinPayout.length)];
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
