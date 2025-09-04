// Game timing constants
const GAME_TIMINGS = {
  BETTING_PHASE: 15000, // 15 seconds
  RESULT_PHASE: 25000, // 25 seconds total
  NEXT_ROUND_DELAY: 8000, // 8 seconds between rounds
};

// Redis keys
const REDIS_KEYS = {
  GAME_STATE: "roulette:gameState",
  WINNERS_LIST: "roulette:recentWinners",
};

// Game configuration
const GAME_CONFIG = {
  MAX_BETS_PER_USER: 5000,
  MAX_RECENT_WINNERS: 10,
  MAX_LAST_RESULTS: 10,
  REAL_BALANCE_RATIO: 0.9,
  TOKEN_BALANCE_RATIO: 0.1,
};

// Fake names for anonymous winners
const FAKE_NAMES = [
  "Anonymous Player",
  "Lucky Star",
  "Fortune Hunter",
  "Roulette King",
  "Spin Master",
  "Golden Player",
  "Mystery Winner",
  "Vegas Pro",
  "Lucky Seven",
  "Jackpot Hero",
  "Wheel Wizard",
  "Fortune Seeker",
  "Lucky Charm",
  "Spin Doctor",
  "Gold Rush",
  "Diamond Player",
  // New suggestions
  "High Roller",
  "Ace Spinner",
  "Lady Luck",
  "Royal Flush",
  "Casino Shark",
  "Lucky Streak",
  "Midnight Gambler",
  "Card Whisperer",
  "The House Edge",
  "Treasure Spinner",
  "Silver Chips",
  "Cash King",
  "Mr. Blackjack",
  "Lucky Dice",
  "Slot Machine Pro",
  "Golden Hand",
  "Roulette Rebel",
  "Jackpot Jester",
  "Queen of Spins",
  "Money Magnet",
  "Spin Genius",
];


module.exports = {
  GAME_TIMINGS,
  REDIS_KEYS,
  GAME_CONFIG,
  FAKE_NAMES,
};
