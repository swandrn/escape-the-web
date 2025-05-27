import { useState } from "react";
import { SafePuzzle } from "./components/SafePuzzle";
import { HiddenWordPuzzle } from "./components/HiddenWordPuzzle";
import { ColorOrderPuzzle } from "./components/ColorOrderPuzzle";

type PuzzleKey = "safe" | "hiddenWord" | "colorOrder" | "none";

const puzzleOrder: PuzzleKey[] = ["safe", "hiddenWord", "colorOrder"];

export default function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<PuzzleKey>("safe");
  const [solved, setSolved] = useState<PuzzleKey[]>([]);

  const handleSuccess = () => {
    // Mark solved
    setSolved((prev) => [...prev, currentPuzzle]);

    // Compute next unsolved
    const next = (() => {
      const start = puzzleOrder.indexOf(currentPuzzle);
      for (let offset = 1; offset <= puzzleOrder.length; offset++) {
        const idx = (start + offset) % puzzleOrder.length;
        const candidate = puzzleOrder[idx];
        if (![...solved, currentPuzzle].includes(candidate)) {
          return candidate;
        }
      }
      return "none" as PuzzleKey;
    })();

    setCurrentPuzzle(next);
  };

  const isSolved = (key: PuzzleKey) => solved.includes(key);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <nav style={{ marginBottom: "1.5rem", textAlign: "center" }}>
        {puzzleOrder.map((key) => (
          <button
            key={key}
            onClick={() => setCurrentPuzzle(key)}
            disabled={isSolved(key)}
            style={{ margin: "0 0.5rem" }}
          >
            {key === "safe"
              ? "Safe Puzzle"
              : key === "hiddenWord"
              ? "Hidden Word"
              : "Color Order"}
          </button>
        ))}
      </nav>

      {currentPuzzle === "safe" && (
        <SafePuzzle onSuccess={handleSuccess} secret="1234" />
      )}
      {currentPuzzle === "hiddenWord" && (
        <HiddenWordPuzzle onSuccess={handleSuccess} secret="REACT" />
      )}
      {currentPuzzle === "colorOrder" && (
        <ColorOrderPuzzle
          onSuccess={handleSuccess}
          secret={["blue", "red", "yellow"]}
        />
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
