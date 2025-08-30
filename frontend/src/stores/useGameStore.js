import { create } from "zustand";

export const useGameStore = create((set, get) => ({
  // Connection state
  isConnected: false,
  socketId: null,

  // Game state
  round: null,
  phase: null,
  result: null,
  roundEndTime : null,
  winStatus: {
    isWin: null,
    amount: null,
  },
  isMuted: false,
  isGameRunning: false,

  // Game data
  lastResults: [],
  recentWinners: [],
  messages: "",
  loading: false,

  // Actions to update state (called from useGameSocket)
  setConnection: (connected, socketId = null) =>
    set({ isConnected: connected, socketId }),

  setRound: (roundId) => set({ round: roundId }),

  setPhase: (phase) => set({ phase }),

  setResult: (result) => set({ result }),

  setRoundEndTime : (time) => set({roundEndTime:time}),

  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

  setLastResults: (lastResults) => set({ lastResults }),

  setRecentWinners: (recentWinners) => set({ recentWinners }),

  setMessages: (messages) => set({ messages }),

  setGameRunning: (isGameRunning) => set({ isGameRunning }),

  setWinStatus: (isWin, amount) => set({ winStatus: { isWin, amount } }),
  setLoading: (loading) => set({ loading }),
  // Bulk updates for efficiency
  updateGameState: (updates) => set((state) => ({ ...state, ...updates })),

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
      loading , 
      setLoading
    }),
}));
