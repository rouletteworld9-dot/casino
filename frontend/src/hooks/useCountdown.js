// hooks/useCountdown.js
import { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";
const tickAudio = new Audio("/sounds/tick.mp3");
const finishAudio = new Audio("/sounds/finish.mp3");

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function useCountdown() {
  const { roundEndTime, phase, isMuted, result } = useGameStore();
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (phase === "result" && result && !isMuted) {
      setTimeout(() => {
        announceNumber(result);
      }, 5000);
    }
  }, [phase, isMuted]);

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
  finishAudio.currentTime = 0;
  finishAudio.play();
}

function getVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    speechSynthesis.onvoiceschanged = () => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
    };
  });
}


export async function announceNumber(number) {
  if (!("speechSynthesis" in window)) {
    console.log("Speech synthesis not supported in this browser.");
    return;
  }

  const voices = await getVoices();

  const preferredFemaleVoiceNames = [
    "Samantha",
    "Google UK English Female",
    "Google US English Female",
    "Zira",
  ];

  // Pick female voice from preferred list
  let femaleVoice = voices.find((v) =>
    preferredFemaleVoiceNames.includes(v.name)
  );

  // If not found, try to detect by name keywords
  if (!femaleVoice) {
    femaleVoice = voices.find((v) =>
      /female|woman|samantha|zira|uk english/i.test(v.name)
    );
  }

  if (!femaleVoice) {
    console.warn("No female voice found, skipping announcement.");
    return;
  }

  const utterance = new SpeechSynthesisUtterance(number.toString());
  utterance.voice = femaleVoice;
  utterance.lang = "en-US";
  utterance.pitch = 1.4;   // higher pitch
  utterance.rate = 1.05;

  speechSynthesis.speak(utterance);
}

