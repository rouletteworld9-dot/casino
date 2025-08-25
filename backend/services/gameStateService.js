const redisManager = require("../utils/redisManager");
const { REDIS_KEYS } = require("../config/constants");

// Local fallback storage
let localGameState = getDefaultGameState();

function getDefaultGameState() {
  return {
    phase: "waiting",
    roundId: null,
    bets: [],
    winningNumber: null,
    nextWinningNumber: null,
    lastResults: [],
    isGameRunning: false,
  };
}

async function getGameState() {
  const redisData = await redisManager.get(REDIS_KEYS.GAME_STATE);
  return redisData || localGameState;
}

async function setGameState(newState) {
  const success = await redisManager.set(REDIS_KEYS.GAME_STATE, newState);
  if (!success) {
    localGameState = newState;
  }
  return success;
}

async function initGameState() {
  const connected = await redisManager.connect();
  
  if (connected) {
    const exists = await redisManager.exists(REDIS_KEYS.GAME_STATE);
    if (!exists) {
      await setGameState(getDefaultGameState());
    }
  }
  
  return connected;
}

module.exports = {
  getGameState,
  setGameState,
  initGameState,
  getDefaultGameState,
};