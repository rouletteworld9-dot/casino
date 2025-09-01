import { useGameStore } from "../stores/useGameStore";

export default function MuteButton() {
  const isMuted = useGameStore((state) => state.isMuted);
  const toggleMute = useGameStore((state) => state.toggleMute);

  return (
    <button
      onClick={toggleMute}
      // className="fixed top-16 right-4 bg-goldCasino text-white p-2 rounded-full shadow-sm shadow-white cursor-pointer"
      className="fixed top-23 sm:top-20 sm:right-4 right-0 bg-goldCasino z-[100] text-white sm:p-2 p-1.5 rounded-full shadow-sm shadow-white cursor-pointer"
    >
      {isMuted ? "🔇" : "🔊"}
    </button>
  );
}
