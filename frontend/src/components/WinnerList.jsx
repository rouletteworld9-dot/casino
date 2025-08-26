import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { useGameSocket } from "../hooks/useGameSocket";
import { useDelay } from "../hooks/useDelay";
// import { User } from "lucide-react";

export default function WinnerList() {
  const { recentWinners: newWinners } = useGameSocket();
  const delayedWinners = useDelay(newWinners, 4000);

  const [winners, setWinners] = useState([]);
  const [newWinner, setNewWinner] = useState(null);

  const listRef = useRef(null);
  const contentRef = useRef(null);
  const newWinnerRef = useRef(null);

  const isPaused = useRef(false);
  const rafIdRef = useRef(null);

  // Handle incoming winners
  useEffect(() => {
    if (!delayedWinners) return;

    const incoming = Array.isArray(delayedWinners)
      ? delayedWinners
      : [delayedWinners];

    setWinners((prev) => {
      const merged = [...prev, ...incoming].slice(-12); // keep last 12
      return merged;
    });

    const latest = incoming[incoming.length - 1];
    if (latest) {
      setNewWinner(latest);
      setTimeout(() => setNewWinner(null), 4000);
    }
  }, [delayedWinners]);

  // Animate new winner
  useEffect(() => {
    if (delayedWinners && newWinnerRef.current) {
      anime({
        targets: newWinnerRef.current,
        scale: [0.8, 1.1, 1],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutElastic(1, 0.5)",
      });
      playNotificationSound();
    }
  }, [delayedWinners]);

  // Auto-scroll loop
  useEffect(() => {
    const container = listRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    if (content.offsetHeight <= container.clientHeight) return;

    let last = performance.now();
    const SPEED_PX_PER_SEC = 20;

    const step = (now) => {
      const dt = Math.min(now - last, 50);
      last = now;

      if (!isPaused.current) {
        container.scrollTop += (SPEED_PX_PER_SEC * dt) / 500;

        if (container.scrollTop >= content.offsetHeight) {
          container.scrollTop = 0; // reset to top for looping
        }
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [winners.length]);

  const playNotificationSound = () => {
    try {
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.1
      );

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      console.log("Audio notification not supported");
    }
  };

  const isJackpot = (amount) => amount > 10000;

  const renderItem = (item, index, { showEffects, isClone }) => (
    <div
      key={`${item.username}-${item.amount}-${index}${isClone ? "-clone" : ""}`}
      ref={showEffects && item === newWinner ? newWinnerRef : null}
      className="relative transition-all scroll-hidden duration-300"
    >
      {showEffects && item === newWinner && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded-full casino-bounce casino-glow text-[10px]">
          NEW!
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-casinoGold truncate max-w-20">
            ₹{item.amount || "000"}
          </div>
          <div className="text-xs font-semibold text-casinoGold truncate max-w-20">
            {item.username || "Anonymous"}
          </div>
        </div>
      </div>

      {showEffects && item === newWinner && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"></div>
          <div
            className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"
            style={{ animationDelay: "0.8s" }}
          ></div>
        </div>
      )}

      {showEffects && isJackpot(item.amount) && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-40 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      )}
    </div>
  );

  console.log(newWinner, "winner");
  // Reverse so latest shows first
  const data = winners.slice().reverse();

  return (
    <motion.div
      className="fixed z-999 left-4 w-60 h-40"
      initial={{ bottom: 0, opacity: 0 }}
      animate={{ bottom: 16, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="flex items-center space-x-1 text-white font-bold">
        <span>🏆 Winners</span>
      </h1>

      <AnimatePresence mode="wait">
        {newWinner && (
          <div className="flex space-x-2">
            <motion.p
              key={newWinner.username} // re-trigger animation on change
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-lg text-yellow-400 font-semibold"
            >
              🎉 {newWinner.username}
            </motion.p>
            <motion.p
              key={newWinner.amount} // re-trigger animation on change
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-lg text-yellow-400 font-semibold"
            >
              ₹{newWinner.amount}
            </motion.p>
          </div>
        )}
      </AnimatePresence>

      <hr className="h-1 border-gray-600 mt-2" />

      <div
        className="px-3 py-2 h-full overflow-y-auto scroll-hidden"
        ref={listRef}
      >
        {data.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-2xl mb-2">🎲</div>
            <p className="text-xs">Waiting for winners...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div ref={contentRef} className="space-y-2">
              {data.map((w, i) =>
                renderItem(w, i, { showEffects: true, isClone: false })
              )}
            </div>
            {/* clone for smooth infinite scroll */}
            <div className="space-y-1" aria-hidden="true">
              {data.map((w, i) =>
                renderItem(w, i, { showEffects: false, isClone: true })
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
