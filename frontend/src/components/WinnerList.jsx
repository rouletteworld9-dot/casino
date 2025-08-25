import { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { useGameSocket } from "../hooks/useGameSocket";

export default function WinnerList() {
  const { recentWinners: newWinners } = useGameSocket();
  const [winners, setWinners] = useState([]);
  const [newWinner, setNewWinner] = useState(null);
  const listRef = useRef(null);
  const newWinnerRef = useRef(null);

  useEffect(() => {
    if (!newWinners?.length > 0) return;

    const updated = newWinners.slice(-12); // Show last 12 winners for vertical layout
    
    // Check if there's a new winner
    if (winners.length > 0 && updated.length > winners.length) {
      const latestWinner = updated[updated.length - 1];
      setNewWinner(latestWinner);
      
      // Clear the new winner highlight after 3 seconds
      setTimeout(() => setNewWinner(null), 3000);
    }
    
    setWinners(updated);
  }, [newWinners, winners.length]);

  // Animation for new winner entry
  useEffect(() => {
    if (newWinner && newWinnerRef.current) {
      // Compact entrance animation for new winner
      anime({
        targets: newWinnerRef.current,
        scale: [0.8, 1.1, 1],
        opacity: [0, 1],
        duration: 800,
        easing: "easeOutElastic(1, 0.5)",
      });
      
      // Play notification sound for new winners
      playNotificationSound();
    }
  }, [newWinner]);

  // Auto-scroll to top when new winners are added
  useEffect(() => {
    if (listRef.current && winners.length > 0) {
      // Scroll to top to show the newest winner
      anime({
        targets: listRef.current,
        scrollTop: 0,
        duration: 600,
        easing: "easeOutQuad",
      });
    }
  }, [winners]);

  // Function to play notification sound
  const playNotificationSound = () => {
    try {
      // Create a simple notification sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Silently fail if audio is not supported
      console.log('Audio notification not supported');
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getBetTypeColor = (betType) => {
    const colors = {
      straight: 'text-blue-400',
      split: 'text-purple-400',
      street: 'text-green-400',
      corner: 'text-yellow-400',
      line: 'text-pink-400',
      column: 'text-indigo-400',
      dozen: 'text-orange-400',
      red: 'text-red-400',
      black: 'text-gray-400',
      odd: 'text-cyan-400',
      even: 'text-teal-400',
      low: 'text-lime-400',
      high: 'text-amber-400'
    };
    return colors[betType] || 'text-white';
  };

  const isJackpot = (amount) => amount > 10000; // Consider wins over 10k as jackpot

  return (
    <div className="fixed left-4 bottom-4 w-64 h-80 bg-gradient-to-b from-purple-900/95 to-black/95 backdrop-blur-sm shadow-xl rounded-2xl border border-purple-500/30 overflow-hidden casino-glow">
      {/* Compact Casino-style header */}
      <div className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-400 px-3 py-1 text-center relative overflow-hidden casino-shine">
        <h3 className="text-sm font-bold text-black relative z-10 flex items-center justify-center gap-1">
          <span className="text-lg animate-bounce">🎰</span>
          WINNERS
          <span className="text-lg animate-bounce" style={{animationDelay: '0.5s'}}>🎰</span>
        </h3>
      </div>

      {/* Vertical Winners list */}
      <div className="px-3 py-2 h-full overflow-y-auto custom-scroll" ref={listRef}>
        {winners.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-2xl mb-2">🎲</div>
            <p className="text-xs">Waiting for winners...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {winners.slice().reverse().map((winner, index) => (
              <div
                key={`${winner.username}-${winner.timestamp}-${index}`}
                ref={winner === newWinner ? newWinnerRef : null}
                className={`winner-item relative bg-gradient-to-r from-gray-800/80 to-gray-700/80 backdrop-blur-sm 
                  rounded-lg p-2 border transition-all duration-300 hover:scale-105 hover:shadow-lg
                  ${winner === newWinner 
                    ? 'border-yellow-400 shadow-lg shadow-yellow-400/50 bg-gradient-to-r from-yellow-900/30 to-orange-900/30' 
                    : 'border-gray-600/50 hover:border-purple-500/50'
                  }`}
              >
                {/* Winner badge for new winners */}
                {winner === newWinner && (
                  <div className="absolute -top-1 -right-1 bg-yellow-400 text-black text-xs font-bold px-1 py-0.5 rounded-full casino-bounce casino-glow text-[10px]">
                    NEW!
                  </div>
                )}

                {/* Compact Winner info in horizontal layout */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-xs">
                      {winner.username?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white truncate max-w-20">
                        {winner.username || 'Anonymous'}
                      </div>
                      <div className={`text-[10px] ${getBetTypeColor(winner.betType)}`}>
                        {winner.betType || 'unknown'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isJackpot(winner.amount) ? 'text-yellow-400 casino-glow' : 'text-green-400'}`}>
                      {isJackpot(winner.amount) && <span className="text-xs mr-1">🎉</span>}
                      ₹{winner.amount?.toLocaleString() || '0'}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      {formatTime(winner.timestamp)}
                    </div>
                    {isJackpot(winner.amount) && (
                      <div className="text-[10px] text-yellow-400 font-bold mt-1 casino-shine">
                        JACKPOT!
                      </div>
                    )}
                  </div>
                </div>

                {/* Animated sparkles for new winners */}
                {winner === newWinner && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1 left-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle" style={{animationDelay: '0.5s'}}></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle" style={{animationDelay: '1s'}}></div>
                    <div className="absolute bottom-1 right-1 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle" style={{animationDelay: '0.8s'}}></div>
                  </div>
                )}

                {/* Extra sparkles for jackpot wins */}
                {isJackpot(winner.amount) && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle" style={{animationDelay: '0.3s'}}></div>
                    <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-yellow-400 rounded-full casino-sparkle" style={{animationDelay: '0.7s'}}></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Casino-style footer */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"></div>
    </div>
  );
}
