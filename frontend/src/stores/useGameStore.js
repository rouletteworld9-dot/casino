import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  // Connection state
  isConnected: false,
  socketId: null,
  totalBetAmount: 0,
  // Game state
  round: null,
  phase: null,
  result: null,

  countDown: {
    roundEndTime: null,
    serverTime: null,
  },

  tempWinResults: [],

  winStatus: {
    isWin: null,
    amount: null,
  },

  isMuted: true,
  isGameRunning: false,

  // Game data
  lastResults: [],
  recentWinners: [],
  messages: "",
  loading: false,
  flyingChips: [],

  setTempWinResults: (result) =>
    set((state) => {
      const updatedTempWinResults = [...state.tempWinResults, result];
      // Check if there's a winning result with a valid amount
      const winningResult = updatedTempWinResults.find(
        (r) => r.isWin === true && typeof r.amount === "number"
      );
      return {
        tempWinResults: updatedTempWinResults,
        winStatus: {
          isWin: winningResult ? true : false,
          amount: winningResult ? winningResult.amount : null,
        },
      };
    }),

  setFlyingChips: (next) =>
    set((state) => ({
      flyingChips: typeof next === "function" ? next(state.flyingChips) : next,
    })),

  // Actions to update state (called from useGameSocket)
  setConnection: (connected, socketId = null) =>
    set({ isConnected: connected, socketId }),

  setRound: (roundId) => set({ round: roundId }),

  setPhase: (phase) =>
    set(() => {
      if (phase === "betting") {
        return {
          phase: phase,
          tempWinResults: [],
          winStatus: {
            isWin: null,
            amount: null,
          },
        };
      } else {
        return { phase: phase };
      }
    }),

  setResult: (result) => set({ result }),

  setCountDown: (roundEndTime, serverTime) =>
    set({
      countDown: {
        roundEndTime: roundEndTime,
        serverTime: serverTime,
      },
    }),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setLastResults: (lastResults) => set({ lastResults }),

  setRecentWinners: (recentWinners) => set({ recentWinners }),

  setMessages: (messages) => set({ messages }),

  setGameRunning: (isGameRunning) => set({ isGameRunning }),

  setWinStatus: (isWin, amount) => set({ winStatus: { isWin, amount } }),
  setLoading: (loading) => set({ loading }),
  // Bulk updates for efficiency
  updateGameState: (updates) => set((state) => ({ ...state, ...updates })),

  setTotalBetAmount: (amount) => set({ totalBetAmount: amount }),

  // Reset all state
  reset: () =>
    set({
      isConnected: false,
      socketId: null,
      round: null,
      phase: null,
      result: null,
      isGameRunning: false,
      lastResults: [],
      recentWinners: [],
      messages: "",
      loading: false,
      totalBetAmount: 0,
      winStatus: { isWin: null, amount: null },
      isMuted: false,
      flyingChips,
      countDown: {
        roundEndTime: null,
        serverTime: null,
      },
    }),
}));
