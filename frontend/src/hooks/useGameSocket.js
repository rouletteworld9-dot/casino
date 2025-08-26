import { useEffect, useState } from "react";
import { socket } from "../socket";
import toast from "react-hot-toast";
import { useAuthStore } from "../stores/useAuthStore";

export function useGameSocket() {
  const user = useAuthStore((state) => state.user);
  let userId = user?._id;

  const [round, setRound] = useState(null);
  const [phase, setPhase] = useState(null);
  const [result, setResult] = useState(null);
  const [bets, setBets] = useState([]);
  const [recentWinners, setRecentWinners] = useState([]);
  const [lastResults, setLastResults] = useState([]);
  const [messages, setMessages] = useState("");
  const [preResult, setPreResult] = useState(null);


  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to server with id:", socket.id);
    });

    socket.on("error", (err) => {
      if (err?.message) toast.error(err.message);
      console.error("Socket error:", err);
    });

    socket.on("syncState", (data) => {
      setRound(data.roundId);
      setPhase(data.phase);
      setResult(data.winningNumber);
      setLastResults(data.lastResults);
    });

    // Game lifecycle
    socket.on("gameStarted", (data) => {
      setRound(data.roundId);
      setPhase("betting");
      setMessages("Game started");
    });

    socket.on("bettingClosed", () => {
      setPhase("spinning");
      setMessages("Betting closed");
    });

    socket.on("spinning", (data) => {
      setPreResult(data.winningNumber);
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
      setMessages(data.win ? `You won ${data.payout}` : "You lost");
    });

    return () => {
      socket.off(" ");
      socket.off("lastResults");
      socket.off("gameStarted");
      socket.off("bettingClosed");
      socket.off("spinning");
      socket.off("result");
      socket.off("betResult");
      socket.off("error");
      socket.off("betsPlaced");
      socket.disconnect();
    };
  }, [userId]);

  const updateBetData = (field, value) => {
    setBetData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Place a bet
  const emitPlaceBet = (data) => {
    console.log(data);
    if (!round) {
      toast.error("No round active");
      return;
    }

    console.log(data, "at socket");

    socket.emit("placeBets", data);

    setBets((prev) => [...prev, betData]);
    toast.success("Bet placed!");
  };

  const forceResult = (num) => {
    if (!num) return;
    socket.emit("forceResult", num);
    toast.success("Result Adjusted Success");
  };

  return {
    round,
    phase,
    result,
    bets,
    emitPlaceBet,
    preResult,
    recentWinners,
    updateBetData,
    messages,
    lastResults,
    forceResult,
  };
}
