import { useEffect, useState } from "react";
import { socket } from "../socket";
import toast from "react-hot-toast";

export function useGameSocket(userId) {
  const [round, setRound] = useState(null);
  const [phase, setPhase] = useState(null);
  const [result, setResult] = useState(null);
  const [bets, setBets] = useState([]);
  const [lastResults, setLastResults] = useState([]);
  const [messages, setMessages] = useState([]);

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
      setLastResults(data.lastResults)
    });

    socket.on("lastResults", (data) => {
      setLastResults(data);
    });

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
      setMessages((m) => [...m, `Spinning... number = ${data.winningNumber}`]);
    });

    socket.on("roundResult", (data) => {
      setPhase("result");
      setResult(data.winningNumber);
      setLastResults(data.lastResults)
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

  // Place a bet
  const placeBet = (bet) => {
    if (!round) {
      alert("No round active");
      return;
    }
    socket.emit("placeBet", {
      roundId: round,
      userId,
      socketId: socket.id,
      ...bet,
    });
    setBets((prev) => [...prev, bet]);
  };

  const forceResult = (num)=>{
    if(!num) return
    socket.emit("forceResult", num)
    toast.success("Result Adjusted Success")
  }

  return { round, phase, result, bets, placeBet, messages, lastResults, forceResult };
}
