// hooks/useCountdown.js - Mobile-compatible version
import { useEffect, useState } from "react";
import { useGameStore } from "../stores/useGameStore";

const tickAudio = new Audio("/sounds/tick.mp3");
const finishAudio = new Audio("/sounds/finish.mp3");

// Flag to track if speech has been initialized
let speechInitialized = false;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// Initialize speech synthesis on first user interaction
function initializeSpeech() {
  if (speechInitialized || !("speechSynthesis" in window)) return;
  
  // Create a silent utterance to initialize speech synthesis
  const utterance = new SpeechSynthesisUtterance("");
  utterance.volume = 0;
  speechSynthesis.speak(utterance);
  speechInitialized = true;
  
  console.log("Speech synthesis initialized");
}

export default function useCountdown() {
  const { roundEndTime, phase, isMuted, result } = useGameStore();
  const [remaining, setRemaining] = useState(null);

  // Initialize speech on component mount (requires user interaction first)
  useEffect(() => {
    // Add event listeners for user interactions to initialize speech
    const handleUserInteraction = () => {
      initializeSpeech();
      // Remove listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);

    return () => {
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (phase === "result" && result && !isMuted) {
      setTimeout(() => {
        announceNumber(result);
      }, 5000);
    }
  }, [phase, isMuted, result]);

  useEffect(() => {
    if (phase !== "betting" || !roundEndTime) {
      setRemaining(null);
      return;
    }

    const updateRemaining = () => {
      const diff = Math.floor((roundEndTime - Date.now()) / 1000);
      setRemaining(diff >= 0 ? diff : 0);
    };

    updateRemaining();
    const interval = setInterval(updateRemaining, 1000);

    return () => clearInterval(interval);
  }, [roundEndTime, phase]);

  // Sound control
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
  finishAudio.play().catch(() => {});
}

function getVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length) {
      resolve(voices);
      return;
    }
    
    // Wait for voices to load
    const timeout = setTimeout(() => {
      resolve(speechSynthesis.getVoices());
    }, 1000);
    
    speechSynthesis.onvoiceschanged = () => {
      clearTimeout(timeout);
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

  try {
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const voices = await getVoices();
    console.log("Available voices:", voices.length);

    if (voices.length === 0) {
      console.warn("No voices available");
      return;
    }

    // More comprehensive voice selection for mobile
    const preferredVoiceNames = [
      "Samantha",
      "Google UK English Female", 
      "Google US English Female",
      "Zira",
      "Microsoft Zira",
      "Karen", // iOS
      "Moira", // iOS
      "Tessa", // iOS
    ];

    // Try preferred voices first
    let selectedVoice = voices.find((v) =>
      preferredVoiceNames.some(name => v.name.includes(name))
    );

    // Fallback: look for female voices by keywords
    if (!selectedVoice) {
      selectedVoice = voices.find((v) =>
        /female|woman|samantha|zira|karen|moira|tessa|uk english/i.test(v.name)
      );
    }

    // Final fallback: use default voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.default) || voices[0];
      console.log("Using default/first voice:", selectedVoice?.name);
    }

    const utterance = new SpeechSynthesisUtterance(number.toString());
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    utterance.lang = "en-US";
    utterance.volume = 1;
    utterance.pitch = 1.2;  // Slightly lower for mobile compatibility
    utterance.rate = 0.9;   // Slower for mobile

    // Add error handling
    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event.error);
    };

    utterance.onstart = () => {
      console.log("Speech started");
    };

    utterance.onend = () => {
      console.log("Speech ended");
    };

    // Ensure speech synthesis is not paused
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
    }

    speechSynthesis.speak(utterance);
    
  } catch (error) {
    console.error("Error in announceNumber:", error);
  }
}