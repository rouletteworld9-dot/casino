const gameStateService = require("../services/gameStateService");
const winnersService = require("../services/winnersService");
const betService = require("../services/betService");
const gameLogic = require("./gameLogic");
const timerManager = require("./timerManager");
const { GAME_TIMINGS } = require("../config/constants");

async function initGameState() {
  const redisConnected = await gameStateService.initGameState();
  await winnersService.initWinnersService();
  return redisConnected;
}

async function startGame(io) {
  const gameState = await gameStateService.getGameState();

  if (gameState.isGameRunning) {
    return false;
  }

  timerManager.clearAllTimers();

  const newGameState = {
    ...gameState,
    isGameRunning: true,
    roundId: Date.now().toString(),
    bets: [],
    phase: "betting",
    winningNumber: null,
  };

  await gameStateService.setGameState(newGameState);
  io.emit("gameStarted", { roundId: newGameState.roundId, phase: "betting" });

  // Set betting phase timer
  timerManager.setBettingTimer(async () => {
    await handleBettingPhaseEnd(io, newGameState.roundId);
  }, GAME_TIMINGS.BETTING_PHASE);

  // Set result phase timer
  timerManager.setResultTimer(async () => {
    await handleResultPhase(io, newGameState.roundId);
  }, GAME_TIMINGS.RESULT_PHASE);

  return true;
}

async function handleBettingPhaseEnd(io, expectedRoundId) {
  const currentState = await gameStateService.getGameState();

  if (currentState.roundId !== expectedRoundId) {
    return;
  }

  const winningNumber = gameLogic.generateWinningNumber(currentState);

  const updatedState = {
    ...currentState,
    phase: "spinning",
    winningNumber,
    nextWinningNumber: null,
  };

  await gameStateService.setGameState(updatedState);
  io.emit("bettingClosed");
  io.emit("spinning", { winningNumber });
}

async function handleResultPhase(io, expectedRoundId) {
  const currentState = await gameStateService.getGameState();

  if (currentState.roundId !== expectedRoundId) {
    return;
  }

  const updatedState = {
    ...currentState,
    phase: "result",
  };
  await gameStateService.setGameState(updatedState);

  const updatedWinners = await betService.settleBets(
    currentState.bets,
    currentState.winningNumber,
    io
  );
  const updatedResults = gameLogic.updateLastResults(
    currentState.lastResults,
    currentState.winningNumber,
    currentState.roundId,
    currentState.bets
  );

  const finalState = {
    ...updatedState,
    lastResults: updatedResults,
    isGameRunning: false,
  };

  await gameStateService.setGameState(finalState);

  io.emit("roundResult", {
    winningNumber: currentState.winningNumber,
    lastResults: finalState.lastResults,
    recentWinners: updatedWinners,
  });

  timerManager.setNextRoundTimer(
    () => startGame(io),
    GAME_TIMINGS.NEXT_ROUND_DELAY
  );
}

async function placeBets(socket, data) {
  
  const gameState = await gameStateService.getGameState();

  if (gameState.phase !== "betting") {
    throw new Error("Betting closed");
  }

  const result = await betService.placeBets(socket, {
    ...data,
    roundId: gameState.roundId,
  });
  


  const updatedState = {
    ...gameState,
    bets: [...gameState.bets, ...result.processedBets],
  };

  await gameStateService.setGameState(updatedState);
  return result;
}

async function forceResult(number) {
  const gameState = await gameStateService.getGameState();
  const updatedState = {
    ...gameState,
    nextWinningNumber: number,
  };
  await gameStateService.setGameState(updatedState);
}

async function stopGame() {
  timerManager.clearAllTimers();
  const gameState = await gameStateService.getGameState();
  const updatedState = {
    ...gameState,
    isGameRunning: false,
    phase: "waiting",
  };
  await gameStateService.setGameState(updatedState);
}

async function getCurrentGameState() {
  const gameState = await gameStateService.getGameState();
  const recentWinners = await winnersService.getRecentWinners();

  return {
    ...gameState,
    recentWinners,
  };
}

module.exports = {
  initGameState,
  startGame,
  placeBets,
  forceResult,
  stopGame,
  getCurrentGameState,
};
