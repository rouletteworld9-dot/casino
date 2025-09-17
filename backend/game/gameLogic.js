const { validateBet, VALID_BET_TYPES } = require("./betValidator");
const payouts = require('./payouts');

function generateWinningNumber(gameState) {

  if (gameState.nextWinningNumber !== null) {
    console.log(`Using forced winning number: ${gameState.nextWinningNumber}`);
    return gameState.nextWinningNumber;
  }

  if (gameState.bets.length === 0) {
    const randomNum = Math.floor(Math.random() * 37);
    console.log(`No bets placed, generating random number: ${randomNum}`);
    return randomNum;
  }

  // Calculate total payout for each possible number (0-36)
  const payoutForNumber = {};

  for (let number = 0; number <= 36; number++) {
    payoutForNumber[number] = 0;

    // Check each bet to see if this number wins
    for (const bet of gameState.bets) {
      if (validateBet(bet, number)) {
        const payout = bet.amount * payouts[bet.type];
        payoutForNumber[number] += payout;
        console.log(`Number ${number} would win bet: ${bet.type} (${bet.numbers}) - Payout: ${payout}`);
      }
    }
  }

  // THIS IS THE PROBLEM! The current logic finds MINIMUM payout (house wins more)
  // Find minimum payout (current logic - PROBLEMATIC)
  let minPayout = Infinity;
  for (let number = 0; number <= 36; number++) {
    if (payoutForNumber[number] < minPayout) {
      minPayout = payoutForNumber[number];
    }
  }

  // Find all numbers with minimum payout
  let numbersWithMinPayout = [];
  for (let number = 0; number <= 36; number++) {
    if (payoutForNumber[number] === minPayout) {
      numbersWithMinPayout.push(number);
    }
  }

  // Safety check
  if (numbersWithMinPayout.length === 0) {
    const randomNum = Math.floor(Math.random() * 37);
    console.log(`Safety fallback - random number: ${randomNum}`);
    return randomNum;
  }

  // Randomly select from numbers that minimize payout (HOUSE ALWAYS WINS!)
  const selectedNumber = numbersWithMinPayout[Math.floor(Math.random() * numbersWithMinPayout.length)];

  // Show which players will win/lose
  for (const bet of gameState.bets) {
    const isWin = validateBet(bet, selectedNumber);
  }

  return selectedNumber;
}

// ALTERNATIVE FAIR VERSION - Uncomment this to replace the function above

// function generateWinningNumber(gameState) {
//   if (gameState.nextWinningNumber !== null) {
//     return gameState.nextWinningNumber;
//   }

//   // Simply generate a truly random number (fair game)
//   const winningNumber = Math.floor(Math.random() * 37);

//   return winningNumber;
// }

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

  const updatedResults = [newResult, ...currentResults.slice(0, 9)];

  return updatedResults;
}

module.exports = {
  generateWinningNumber,
  updateLastResults,
};
