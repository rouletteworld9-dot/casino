import { useEffect } from "react";
import { socket } from "../socket";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";
import { useGameStore } from "../stores/useGameStore";
import { setAmountStore } from "../stores/setAmountStore";

export function useGameSocket() {
  const user = useAuthStore((state) => state.user);
  let userId = user?._id;

  // Get state and actions from Zustand store
  const {
    round,
    setTempWinResults,
    setConnection,
    setRound,
    setPhase,
    setResult,
    setLastResults,
    setRecentWinners,
    setMessages,
    updateGameState,
    betsPlaced,
    setCountDown,
  } = useGameStore();

  const setTotalBetAmount = setAmountStore((s) => s.setTotalBetAmount);

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.on("connect", () => {
      setConnection(true, socket.id);
    });

    socket.on("error", (err) => {
      if (err?.message) toast.error(err.message);
      console.error("Socket error:", err);
    });

    socket.on("syncState", (data) => {
      updateGameState({
        round: data.roundId,
        phase: data.phase,
        result: data.winningNumber,
        lastResults: data.lastResults,
        recentWinners: data.recentWinners,
        isGameRunning: data.isGameRunning,
        roundEndTime: data.roundEndTime,
      });
    });

    // Game lifecycle
    socket.on("gameStarted", (data) => {
      setRound(data.roundId);
      setPhase("betting");
      setCountDown(data.roundEndTime,data.serverTime)
      setMessages("Game started");
    });

    socket.on("bettingClosed", (data) => {
      betsPlaced;
      setMessages("Betting closed");
    });
    
    socket.on("spinning", (data) => {
      setPhase("spinning");
      setMessages(`Waiting for result`);
    });

    socket.on("roundResult", (data) => {
      setPhase("result");
      setResult(data.winningNumber);
      setLastResults(data.lastResults);
      setRecentWinners(data.recentWinners);
      setMessages(`Result = ${data.winningNumber}`);
    });

    // Update balances immediately after server deducts on bet placement
    socket.on("betsPlaced", (data) => {
      try {
        const current = useAuthStore.getState().user;
        if (current && data?.balances) {
          useAuthStore.setState({
            user: {
              ...current,
              realBalance: data.balances.realBalance,
              playTokens: data.balances.playTokens,
            },
          });
        }
      } catch (_) {}
    });

    socket.on("betResult", (data) => {
      const current = useAuthStore.getState().user;
      if (current && data?.balances) {
        useAuthStore.setState({
          user: {
            ...current,
            realBalance: data.balances.realBalance,
            playTokens: data.balances.playTokens,
          },
        });
      }
      setTempWinResults({isWin:data.win, amount :data.payout});
      setMessages(data.win ? `You won ${data.payout}` : "You lost");
    });

    return () => {
      socket.off("connect");
      socket.off("syncState");
      socket.off("gameStarted");
      socket.off("bettingClosed");
      socket.off("spinning");
      socket.off("roundResult");
      socket.off("betResult");
      socket.off("error");
      socket.off("betsPlaced");
      socket.disconnect();
      setConnection(false);
    };
  }, [userId]);

  // Place a bet
  const emitPlaceBet = (data) => {
    const total = data?.bets.reduce((a, b) => a + b.amount, 0);
    if (!round) {
      toast.error("No round active");
      return;
    }
    socket.emit("placeBets", data);
    toast.success("Bet placed"); 
    setTotalBetAmount(total);
  };

  const forceResult = (num) => {
    if (!num && num !== 0) return;
    socket.emit("forceResult", num);
    toast.success("Result Adjusted Success");
  };

  return {
    emitPlaceBet,
    forceResult,
  };
}
