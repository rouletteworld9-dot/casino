import { useGameStore } from "../stores/useGameStore";

export default function MuteButton() {
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);
  const phase = useGameStore((state) => state.phase);

  if(phase !== "betting") {
    return null;
  }

  const handleToggleMute = () => {
    // Initialize speech synthesis when user interacts with mute button
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance("");
      utterance.volume = 0;
      speechSynthesis.speak(utterance);
    }
    
    toggleMute();
  };

  return (
    <button
      onClick={handleToggleMute}
      className="fixed top-15 sm:top-20 sm:right-4 right-2 bg-goldCasino z-[50] text-white sm:p-2 p-2.5 rounded-full shadow-sm shadow-white cursor-pointer"
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}