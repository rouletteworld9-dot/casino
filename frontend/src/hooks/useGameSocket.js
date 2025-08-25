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
  const [messages, setMessages] = useState([]);
  const [preResult, setPreResult] =useState(null)

  const [betData, setBetData] = useState({
    userId,
    amount: 0,
    betType: "",
    number: null,
  });

  useEffect(() => {
    if (!userId) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Connected to server with id:", socket.id);
    });

    socket.on("syncState", (data) => {
      setRound(data.roundId);
      setPhase(data.phase);
      setResult(data.winningNumber);
      setLastResults(data.lastResults);
    });

    // socket.on("lastResults", (data) => {
    //   setLastResults(data);
    // });

    // Game lifecycle
    socket.on("gameStarted", (data) => {
      setRound(data.roundId);
      setPhase("betting");
      setMessages((m) => [...m, "Game started"]);
    });

    socket.on("bettingClosed", () => {
      setPhase("spinning");
      setMessages((m) => [...m, "Betting closed"]);
    });

    socket.on("spinning", (data) => {
      setPreResult(data.winningNumber)
      setMessages((m) => [...m, `Spinning... number = ${data.winningNumber}`]);
    });

    socket.on("roundResult", (data) => {
      setPhase("result");
      setResult(data.winningNumber);
      setLastResults(data.lastResults);
      setRecentWinners(data.recentWinners);
      setMessages((m) => [...m, `Result = ${data.winningNumber}`]);
    });

    socket.on("betResult", (data) => {
      setMessages((m) => [
        ...m,
        data.win ? `You won ${data.payout}` : "You lost",
      ]);
    });

    return () => {
      socket.off("syncState");
      socket.off("lastResults");
      socket.off("gameStarted");
      socket.off("bettingClosed");
      socket.off("spinning");
      socket.off("result");
      socket.off("betResult");
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
  const placeBet = () => {
    if (!round) {
      toast.error("No round active");
      return;
    }

    if (!betData.amount || betData.amount <= 0) {
      toast.error("Enter a valid bet amount");
      return;
    }

    socket.emit("placeBet", {
      roundId: round,
      userId,
      socketId: socket.id,
      ...betData,
    });

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
    betData,
    placeBet,
    preResult,
    recentWinners,
    updateBetData,
    messages,
    lastResults,
    forceResult,
  };
}
