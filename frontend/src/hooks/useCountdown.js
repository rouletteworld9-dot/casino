// hooks/useCountdown.js
import { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
const tickAudio = new Audio("/sounds/tick.mp3");
const finishAudio = new Audio("/sounds/finish.mp3")

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function useCountdown() {
  const { roundEndTime, phase,isMuted  } = useGameStore();
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (phase !== "betting" || !roundEndTime) {
      setRemaining(null);
      return;
    }

    const updateRemaining = () => {
      const diff = Math.floor((roundEndTime - Date.now()) / 1000);
      setRemaining(diff >= 0 ? diff : 0);
    };

    updateRemaining(); // run immediately
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [roundEndTime, phase]);

  // 🔊 Sound control
  useEffect(() => {
    if (remaining === null || isMuted) return;

    if (remaining <= 0 && remaining > 0) {
      playBeep();
    } else if (remaining > 0) {
      playTick();
    } else if (remaining === 0) {
      playFinish();
    }
  }, [remaining, isMuted]);

  return {
    remaining,
    formatted: remaining !== null ? formatTime(remaining) : null,
  };
}

// -------------------- SOUND HELPERS --------------------
function playTick() {
  tickAudio.currentTime = 0;
  tickAudio.play().catch(() => {});
}

function playBeep() {
  console.log("Beep sound 🔊");

}

function playFinish() {
  finishAudio.currentTime = 0
  finishAudio.play()
}
