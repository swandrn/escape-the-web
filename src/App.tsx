import { useState } from "react";
import { SafePuzzle } from "./components/SafePuzzle";
import { HiddenWordPuzzle } from "./components/HiddenWordPuzzle";

type PuzzleKey = "safe" | "hiddenWord" | "none";

export default function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleKey>("safe");
  const [solved, setSolved] = useState<PuzzleKey[]>([]);

  const handleSuccess = () => {
    // Mark the current as solved
    setSolved((prev) => [...prev, currentPuzzle]);

    // Advance
    if (currentPuzzle === "safe") {
      setCurrentPuzzle("hiddenWord");
    } else if (currentPuzzle === "hiddenWord") {
    } else {
      setCurrentPuzzle("none");
    }
  };

  // Helper to disable if already solved
  const isSolved = (key: PuzzleKey) => solved.includes(key);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      {/* Navigation Buttons */}
      <nav style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        <button
          onClick={() => setCurrentPuzzle("safe")}
          disabled={isSolved("safe")}
          style={{ margin: "0 0.5rem" }}
        >
          Safe Puzzle
        </button>
        <button
          onClick={() => setCurrentPuzzle("hiddenWord")}
          disabled={isSolved("hiddenWord")}
          style={{ margin: "0 0.5rem" }}
        >
          Hidden Word
        </button>
      </nav>

      {/* Puzzle Display */}
      {currentPuzzle === "safe" && (
        <SafePuzzle onSuccess={handleSuccess} secret="1234" />
      )}

      {currentPuzzle === "hiddenWord" && (
        <HiddenWordPuzzle onSuccess={handleSuccess} secret="REACT" />
      )}

      {currentPuzzle === "none" && (
        <div style={{ textAlign: "center" }}>
          <h2>All puzzles complete! 🎉</h2>
          <p>Feel free to reload to start over.</p>
        </div>
      )}
    </div>
  );
}
