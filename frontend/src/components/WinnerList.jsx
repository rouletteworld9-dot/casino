import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { useDelay } from "../hooks/useDelay";
import { useGameStore } from "../stores/useGameStore";
import { useAuthStore } from "../stores/useAuthStore";
import { useSingleUser } from "../hooks/useAdminUsers";
import { setAmountStore } from "../stores/setAmountStore";

export default function WinnerList() {
  const phase = useGameStore((s) => s.phase);
  const totalAmount = setAmountStore((s) => s.totalBetAmount);
  const result = useGameStore((state) => state.result);
  const setTotalBetAmount = setAmountStore((s) => s.setTotalBetAmount);
  const { recentWinners: newWinners } = useGameStore();
  const user = useAuthStore((s) => s.user);
  const { singleUser } = useSingleUser(user?._id);

  const delayResult = useDelay(result, 5000);
  const delayedWinners = useDelay(newWinners, 5000);

  const [winners, setWinners] = useState([]);
  const [newWinner, setNewWinner] = useState(null);
  const [messages, setMessages] = useState([
    { username: "Alice", text: "Hello!" },
    { username: "Bob", text: "Good luck everyone!" },
    { username: "Charlie", text: "Let's win big!" },
    { username: "Dave", text: "I'm feeling lucky!" },
    { username: "Eve", text: "May the odds be in our favor!" },
    { username: "Alice", text: "Hello!" },
    { username: "Bob", text: "Good luck everyone!" },
    { username: "Charlie", text: "Let's win big!" },
    { username: "Dave", text: "I'm feeling lucky!" },
    { username: "Eve", text: "May the odds be in our favor!" },
    { username: "Alice", text: "Hello!" },
    { username: "Bob", text: "Good luck everyone!" },
    { username: "Charlie", text: "Let's win big!" },
    { username: "Dave", text: "I'm feeling lucky!" },
    { username: "Eve", text: "May the odds be in our favor!" },
  ]);
  const [newMessage, setNewMessage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const listRef = useRef(null);
  const contentRef = useRef(null);
  const newWinnerRef = useRef(null);
  const newMessageRef = useRef(null);

  const isPaused = useRef(false);
  const rafIdRef = useRef(null);

  // Debug logging for phase and totals
  useEffect(() => {
    console.log("Phase:", phase);
    console.log("Total Amount:", totalAmount);
    console.log("Balance:", user?.realBalance || singleUser?.realBalance);
  }, [phase, totalAmount, user, singleUser]);

  // Handle incoming winners
  useEffect(() => {
    if (!delayedWinners) return;

    const incoming = Array.isArray(delayedWinners)
      ? delayedWinners
      : [delayedWinners];

    setWinners((prev) => {
      const merged = [...prev, ...incoming].slice(-12); // Keep last 12
      return merged;
    });

    const latest = incoming[incoming.length - 1];
    if (latest) {
      setNewWinner(latest);
      setTimeout(() => setNewWinner(null), 4000);
    }
  }, [delayedWinners]);

  // Reset total bet amount on result
  useEffect(() => {
    if (delayResult) {
      setTotalBetAmount(0);
    }
  }, [delayResult]);

  // Animate new winner or message
  useEffect(() => {
    if (phase === "result" && newWinner && newWinnerRef.current) {
      anime({
        targets: newWinnerRef.current,
        scale: [0.8, 1.1, 1],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutElastic(1, 0.5)",
      });
      playNotificationSound();
    } else if (phase !== "result" && newMessage && newMessageRef.current) {
      anime({
        targets: newMessageRef.current,
        scale: [0.8, 1.1, 1],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutElastic(1, 0.5)",
      });
      playNotificationSound();
    }
  }, [newWinner, newMessage, phase]);

  // Cycle winners or messages in mobile view
  useEffect(() => {
    const data = phase === "result" ? winners : messages;
    if (!data.length) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % data.length);
    }, 3000); // Show each item for 3s
    return () => clearInterval(interval);
  }, [winners, messages, phase]);

  // Auto-scroll loop for desktop
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

        if (
          container.scrollTop >=
          content.offsetHeight - container.clientHeight
        ) {
          container.scrollTop = 0; // Reset to top for looping
        }
      }

      rafIdRef.current = requestAnimationFrame(step);
    };

    rafIdRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafIdRef.current);
  }, [winners.length, messages.length, phase]);

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

  const renderWinnerItem = (item, index, { showEffects, isClone }) => (
    <div
      key={`${item?.username}-${item?.amount}-${index}${isClone ? "-clone" : ""}`}
      ref={showEffects && item === newWinner ? newWinnerRef : null}
      className="relative transition-all scroll-hidden duration-300"
    >
      {showEffects && item === newWinner && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded-full casino-bounce casino-glow sm:text-[10px]">
          NEW!
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-xs font-semibold text-yellow-400 truncate max-w-20">
            ₹{item?.amount || "000"}
          </div>
          <div className="text-xs font-semibold text-yellow-400 truncate max-w-20">
            {item?.username || "Anonymous"}
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
      {showEffects && isJackpot(item?.amount) && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 left-40 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"
            style={{ animationDelay: "0.3s" }}
          ></div>
        </div>
      )}
    </div>
  );

  const renderMessageItem = (item, index, { showEffects, isClone }) => (
    <div
      key={`${item?.username}-${item?.text}-${index}${isClone ? "-clone" : ""}`}
      ref={showEffects && item === newMessage ? newMessageRef : null}
      className="flex items-center relative transition-all scroll-hidden duration-300"
    >
      {showEffects && item === newMessage && (
        <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded-full casino-bounce casino-glow sm:text-[10px]">
          NEW!
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="text-yellow-400 font-semibold text-xs truncate max-w-20">
          {item.username}:
        </span>
        <span className="text-yellow-400 text-xs break-all truncate max-w-32">
          {item.text}
        </span>
      </div>
      {showEffects && item === newMessage && (
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
    </div>
  );

  // Reverse so latest items show first
  const winnerData = winners.slice().reverse();
  const messageData = messages.slice().reverse();

  return (
    <motion.div
      className="fixed z-10 left-1 sm:left-4 w-[90%] sm:w-60 mt-2"
      initial={{ bottom: 0, opacity: 0 }}
      animate={{ bottom: 16, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Desktop: Scrolling panel */}

      <div className="hidden sm:block sm:h-45 relative z-10">
        <h1 className="flex items-center space-x-1 text-white font-bold px-3 pt-2">
          <span>{phase === "result" ? "🏆 Winners" : "💬 Chat"}</span>
        </h1>
        <AnimatePresence mode="wait">
          {phase === "result" && newWinner && (
            <div className="flex space-x-2 mt-1 px-3">
              <motion.p
                key={newWinner?.username}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xs text-yellow-400 font-semibold"
              >
                🎉 {newWinner?.username}
              </motion.p>
              <motion.p
                key={newWinner?.amount}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xs text-yellow-400 font-semibold"
              >
                ₹{newWinner?.amount}
              </motion.p>
            </div>
          )}
          {phase !== "result" && newMessage && (
            <div className="flex space-x-2 mt-1 px-3">
              <motion.p
                key={newMessage?.username}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xs text-yellow-400 font-semibold"
              >
                {newMessage?.username}
              </motion.p>
              <motion.p
                key={newMessage?.text}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-xs text-yellow-400 font-semibold"
              >
                {newMessage?.text}
              </motion.p>
            </div>
          )}
        </AnimatePresence>
        <hr className="h-1 border-gray-600 mt-2 mx-3" />
        <div
          className="py-2 px-3 max-h-[150px] overflow-y-auto scroll-hidden"
          ref={listRef}
        >
          {phase === "result" ? (
            winnerData.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                <div className="text-2xl mb-2">🎲</div>
                <p className="text-xs">Waiting for winners...</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div ref={contentRef} className="space-y-2">
                  {winnerData.map((w, i) =>
                    renderWinnerItem(w, i, {
                      showEffects: true,
                      isClone: false,
                    })
                  )}
                </div>
                <div className="space-y-1" aria-hidden="true">
                  {winnerData.map((w, i) =>
                    renderWinnerItem(w, i, {
                      showEffects: false,
                      isClone: true,
                    })
                  )}
                </div>
              </div>
            )
          ) : messageData.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <div className="text-2xl mb-2">💬</div>
              <p className="text-xs">No messages yet...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div ref={contentRef} className="space-y-2">
                {messageData.map((msg, i) =>
                  renderMessageItem(msg, i, {
                    showEffects: true,
                    isClone: false,
                  })
                )}
              </div>
              <div className="space-y-1" aria-hidden="true">
                {messageData.map((msg, i) =>
                  renderMessageItem(msg, i, {
                    showEffects: false,
                    isClone: true,
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: Single cycling item */}
      <div className="sm:hidden w-[70%] relative z-10 mt-92 ">
        <div className="fixed bottom-15 z-50 px-3 py-2 h-[38px]">
          {phase === "result" ? (
            winnerData.length === 0 ? (
              <p className="text-gray-400 text-[10px]">No winners yet...</p>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-yellow-400 text-[10px] font-bold"
                >
                  {renderWinnerItem(winnerData[activeIndex], activeIndex, {
                    showEffects: true,
                    isClone: false,
                  })}
                </motion.div>
              </AnimatePresence>
            )
          ) : messageData.length === 0 ? (
            <p className="text-gray-400 text-[10px]">No messages yet...</p>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-yellow-400 text-[10px] font-bold"
              >
                {renderMessageItem(messageData[activeIndex], activeIndex, {
                  showEffects: true,
                  isClone: false,
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
        <div className="fixed bottom-1 left-1 w-auto text-white text-[10px] flex flex-col gap-1 z-50 px-3 py-2">
          <span>
            Total Bet:{" "}
            <span className="text-yellow-400">₹{totalAmount ?? 0}</span>
          </span>
          <span>
            Balance:{" "}
            <span className="text-yellow-400">
              ₹{(user?.realBalance || singleUser?.realBalance || 0).toFixed(2)}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
