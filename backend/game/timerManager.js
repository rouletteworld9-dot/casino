class TimerManager {
    constructor() {
      this.timers = {
        bettingTimer: null,
        resultTimer: null,
        nextRoundTimer: null,
      };
    }
    
      clearTimer(timerName) {
        if (this.timers[timerName]) {
          clearTimeout(this.timers[timerName]);
          this.timers[timerName] = null;
        }
      }
     
    setBettingTimer(callback, delay) {
      this.clearTimer('bettingTimer');
      this.timers.bettingTimer = setTimeout(callback, delay);
    }
  
    setResultTimer(callback, delay) {
      this.clearTimer('resultTimer');
      this.timers.resultTimer = setTimeout(callback, delay);
    }
  
    setNextRoundTimer(callback, delay) {
      this.clearTimer('nextRoundTimer');
      this.timers.nextRoundTimer = setTimeout(callback, delay);
    }
    clearAllTimers() {
      Object.keys(this.timers).forEach(timerName => {
        this.clearTimer(timerName);
      });
    }
  
    hasActiveTimers() {
      return Object.values(this.timers).some(timer => timer !== null);
    }
  }
  
  module.exports = new TimerManager();