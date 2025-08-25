const redisManager = require("../utils/redisManager");
const { REDIS_KEYS, FAKE_NAMES, GAME_CONFIG } = require("../config/constants");

// Local fallback storage
let localWinners = [];

async function getRecentWinners() {
  try {
    const redisData = await redisManager.get(REDIS_KEYS.WINNERS_LIST);

    if (Array.isArray(redisData) && redisData.length > 0) {
      return redisData;
    } else if (localWinners.length > 0) {
      return localWinners;
    }

    // Return empty array if no winners exist
    return [];
  } catch (error) {
    console.error("Error getting recent winners:", error);
    // Return local winners or empty array as fallback
    return localWinners.length > 0 ? localWinners : [];
  }
}

async function setRecentWinners(winners) {
  const success = await redisManager.set(REDIS_KEYS.WINNERS_LIST, winners);
  if (!success) {
    localWinners = winners;
  }
  return success;
}

async function addWinner(userId, username, amount, betType) {
  const winners = (await getRecentWinners()) || [];

  const newWinner = {
    id: Date.now().toString(),
    userId: userId,
    username: username || getRandomFakeName(),
    amount: amount,
    betType: betType,
    timestamp: Date.now(),
  };

  const updatedWinners = [
    ...winners.slice(0, GAME_CONFIG.MAX_RECENT_WINNERS - 1),
    newWinner,
  ];
  await setRecentWinners(updatedWinners);

  return updatedWinners;
}

function getRandomFakeName() {
  return FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
}

async function initWinnersService() {
  const exists = await redisManager.exists(REDIS_KEYS.WINNERS_LIST);
  if (!exists) {
    await setRecentWinners([]);
  }
}

module.exports = {
  getRecentWinners,
  addWinner,
  initWinnersService,
  getRandomFakeName,
};
