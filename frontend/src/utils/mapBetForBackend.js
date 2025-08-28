// Roulette layout helper - numbers arranged in 3 columns, 12 rows
function getRouletteLayout() {
  const layout = [];
  for (let row = 0; row < 12; row++) {
    layout.push([
      3 + row * 3, // Column 1: 3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36
      2 + row * 3, // Column 2: 2, 5, 8, 11, 14, 17, 20, 23, 26, 29, 32, 35
      1 + row * 3, // Column 3: 1, 4, 7, 10, 13, 16, 19, 22, 25, 28, 31, 34
    ]);
  }
  return layout;
}

// Get position of a number in the layout
function getNumberPosition(number) {
  if (number === 0) return { row: -1, col: -1 }; // 0 is special

  const layout = getRouletteLayout();
  for (let row = 0; row < layout.length; row++) {
    for (let col = 0; col < layout[row].length; col++) {
      if (layout[row][col] === number) {
        return { row, col };
      }
    }
  }
  return null;
}

// Check if two numbers are adjacent (split bet)
function isSplitBet(num1, num2) {
  if (num1 === 0 || num2 === 0) {
    // 0 can split with 1, 2, 3
    return (
      (num1 === 0 && [1, 2, 3].includes(num2)) ||
      (num2 === 0 && [1, 2, 3].includes(num1))
    );
  }

  const pos1 = getNumberPosition(num1);
  const pos2 = getNumberPosition(num2);

  if (!pos1 || !pos2) return false;

  // Adjacent horizontally (same row, adjacent columns)
  if (pos1.row === pos2.row && Math.abs(pos1.col - pos2.col) === 1) return true;

  // Adjacent vertically (same column, adjacent rows)
  if (pos1.col === pos2.col && Math.abs(pos1.row - pos2.row) === 1) return true;

  return false;
}

// Check if three numbers form a street (horizontal line)
function isStreetBet(numbers) {
  if (numbers.length !== 3) return false;

  const sorted = [...numbers].sort((a, b) => a - b);

  // Check if they're consecutive and in same row
  const pos1 = getNumberPosition(sorted[0]);
  const pos2 = getNumberPosition(sorted[1]);
  const pos3 = getNumberPosition(sorted[2]);

  if (!pos1 || !pos2 || !pos3) return false;

  // Same row and consecutive columns
  return (
    pos1.row === pos2.row &&
    pos2.row === pos3.row &&
    pos1.col === 0 &&
    pos2.col === 1 &&
    pos3.col === 2
  );
}

// Check if four numbers form a corner (square)
function isCornerBet(numbers) {
  if (numbers.length !== 4) return false;

  const positions = numbers.map(getNumberPosition).filter((p) => p !== null);
  if (positions.length !== 4) return false;

  // Check if they form a 2x2 square
  const rows = [...new Set(positions.map((p) => p.row))].sort();
  const cols = [...new Set(positions.map((p) => p.col))].sort();

  return (
    rows.length === 2 &&
    cols.length === 2 &&
    Math.abs(rows[1] - rows[0]) === 1 &&
    Math.abs(cols[1] - cols[0]) === 1
  );
}

// Check if six numbers form a line (two adjacent streets)
function isLineBet(numbers) {
  if (numbers.length !== 6) return false;

  const sorted = [...numbers].sort((a, b) => a - b);

  // Split into two groups of 3
  const group1 = sorted.slice(0, 3);
  const group2 = sorted.slice(3, 6);

  // Check if both groups are streets and adjacent
  if (!isStreetBet(group1) || !isStreetBet(group2)) return false;

  const pos1 = getNumberPosition(group1[0]);
  const pos2 = getNumberPosition(group2[0]);

  return pos1 && pos2 && Math.abs(pos1.row - pos2.row) === 1;
}

// Detect bet type from multiple numbers
function detectBetType(numbers) {
  const uniqueNumbers = [...new Set(numbers)].sort((a, b) => a - b);

  switch (uniqueNumbers.length) {
    case 1:
      return { type: "straight", numbers: uniqueNumbers };

    case 2:
      if (isSplitBet(uniqueNumbers[0], uniqueNumbers[1])) {
        return { type: "split", numbers: uniqueNumbers };
      }
      break;

    case 3:
      if (isStreetBet(uniqueNumbers)) {
        return { type: "street", numbers: uniqueNumbers };
      }
      break;

    case 4:
      if (isCornerBet(uniqueNumbers)) {
        return { type: "corner", numbers: uniqueNumbers };
      }
      break;

    case 6:
      if (isLineBet(uniqueNumbers)) {
        return { type: "line", numbers: uniqueNumbers };
      }
      break;
  }

  // If no special pattern detected, treat as multiple straight bets
  return { type: "multiple_straight", numbers: uniqueNumbers };
}

// Selection tracker for managing multiple selections
class BetSelectionTracker {
  constructor() {
    this.selectedNumbers = new Set();
    this.betAmount = 0;
    this.onSelectionChange = null;
  }

  addNumber(number, amount) {
    this.selectedNumbers.add(parseInt(number));
    this.betAmount = amount;
    this.checkAndNotify();
  }

  removeNumber(number) {
    this.selectedNumbers.delete(parseInt(number));
    this.checkAndNotify();
  }

  clear() {
    this.selectedNumbers.clear();
    this.betAmount = 0;
    this.checkAndNotify();
  }

  hasNumber(number) {
    return this.selectedNumbers.has(parseInt(number));
  }

  getNumbers() {
    return Array.from(this.selectedNumbers);
  }

  checkAndNotify() {
    if (this.onSelectionChange) {
      const numbers = this.getNumbers();
      const detectedBet = detectBetType(numbers);
      this.onSelectionChange({
        numbers,
        detectedBet,
        count: numbers.length,
      });
    }
  }

  setOnSelectionChange(callback) {
    this.onSelectionChange = callback;
  }
}

// Create a global tracker instance
const globalTracker = new BetSelectionTracker();

// Enhanced mapping function that works with current bet tracking
function mapBetForBackend(userId, bet) {
  const { position, amount } = bet;

  // Handle array of positions (multiple straight bets)
  if (Array.isArray(position)) {
    const numbers = position
      .map((p) => parseInt(p, 10))
      .filter((n) => !isNaN(n));
    const detectedBet = detectBetType(numbers);
    return { userId, ...detectedBet, amount };
  }

  // Handle single position
  if (!isNaN(position)) {
    return {
      userId,
      type: "straight",
      numbers: [parseInt(position, 10)],
      amount,
    };
  }

  // Dozens
  if (position === "1st12")
    return { userId, type: "dozen", numbers: [1], amount };
  if (position === "2nd12")
    return { userId, type: "dozen", numbers: [2], amount };
  if (position === "3rd12")
    return { userId, type: "dozen", numbers: [3], amount };

  // Columns
  if (position === "2to1_top")
    return { userId, type: "column", numbers: [1], amount };
  if (position === "2to1_middle")
    return { userId, type: "column", numbers: [2], amount };
  if (position === "2to1_bottom")
    return { userId, type: "column", numbers: [3], amount };

  // Outside bets
  if (position === "red") return { userId, type: "red", numbers: [], amount };
  if (position === "black")
    return { userId, type: "black", numbers: [], amount };
  if (position === "odd") return { userId, type: "odd", numbers: [], amount };
  if (position === "even") return { userId, type: "even", numbers: [], amount };
  if (position === "1-18") return { userId, type: "low", numbers: [], amount };
  if (position === "19-36")
    return { userId, type: "high", numbers: [], amount };

  return null;
}

// NEW: Function to analyze current bets on the board
function analyzeBoardBets(bets) {
  // Extract all number positions that have bets
  const numberBets = Object.keys(bets)
    .filter((key) => !isNaN(key)) // Only number keys
    .map((key) => parseInt(key, 10));

  if (numberBets.length === 0) return [];

  const detectedBet = detectBetType(numberBets);

  return {
    detectedBet,
    numbers: numberBets,
    suggestion: getSuggestion(detectedBet, numberBets),
  };
}

// Get suggestion message for detected patterns
function getSuggestion(detectedBet, numbers) {
  const { type } = detectedBet;

  switch (type) {
    case "split":
      return `✅ Split bet detected on numbers ${numbers.join(", ")} - Pays 17:1`;
    case "street":
      return `✅ Street bet detected on numbers ${numbers.join(", ")} - Pays 11:1`;
    case "corner":
      return `✅ Corner bet detected on numbers ${numbers.join(", ")} - Pays 8:1`;
    case "line":
      return `✅ Line bet detected on numbers ${numbers.join(", ")} - Pays 5:1`;
    case "multiple_straight":
      return `⚠️ Multiple straight bets on numbers ${numbers.join(", ")} - Consider if these form a pattern`;
    default:
      return `Single straight bet on ${numbers[0]} - Pays 35:1`;
  }
}

// NEW: Hook for React components to track selections
function useBetSelection() {
  const [selection, setSelection] = React.useState({
    numbers: [],
    detectedBet: null,
    count: 0,
  });

  React.useEffect(() => {
    globalTracker.setOnSelectionChange(setSelection);
  }, []);

  const addNumber = (number, amount) => globalTracker.addNumber(number, amount);
  const removeNumber = (number) => globalTracker.removeNumber(number);
  const clear = () => globalTracker.clear();
  const hasNumber = (number) => globalTracker.hasNumber(number);

  return {
    selection,
    addNumber,
    removeNumber,
    clear,
    hasNumber,
  };
}

export default mapBetForBackend;
export {
  detectBetType,
  analyzeBoardBets,
  BetSelectionTracker,
  useBetSelection,
  getSuggestion,
};
