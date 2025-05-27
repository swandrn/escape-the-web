import React, { useState } from "react";

interface ColorOrderPuzzleProps {
  secret: string[];
  onSuccess: () => void;
}

export const ColorOrderPuzzle: React.FC<ColorOrderPuzzleProps> = ({
  secret,
  onSuccess,
}) => {
  const allColors = [
    "blue",
    "red",
    "yellow",
    "green",
    "orange",
    "purple",
    "black",
    "white",
  ];

  const [guess, setGuess] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

  const handleSwatchClick = (color: string) => {
    if (unlocked) return;
    const nextGuess = [...guess, color];
    setGuess(nextGuess);

    if (nextGuess.length === secret.length) {
      // auto-submit
      const isCorrect = nextGuess.every(
        (c, i) => c.toLowerCase() === secret[i].toLowerCase(),
      );
      if (isCorrect) {
        setError(null);
        setUnlocked(true);
        setGuess([]);
        onSuccess();
      } else {
        setError("That's not quite right—try again!");
        setAttempts((a) => a + 1);
        setGuess([]);
      }
    }
  };

  const handleClear = () => {
    if (unlocked) return;
    setGuess([]);
    setError(null);
  };

  return (
    <div>
      <p>
        First the calm before the storm,
        <br />
        Then passion’s fire to keep you warm,
        <br />
        Lastly sunshine crowns the day—
        <br />
        Tap in order, don’t lose your way.
      </p>

      {/* Guess chips */}
      <div style={{ display: "flex", gap: "0.5rem", margin: "1rem 0" }}>
        {guess.map((c, i) => (
          <span
            key={i}
            data-testid="guess-chip"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: c,
              color: "#fff",
              borderRadius: "1rem",
              textTransform: "capitalize",
            }}
          >
            {c}
          </span>
        ))}
      </div>

      {/* Error or success */}
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      {unlocked && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ Colors in order!
        </p>
      )}

      {/* Attempts */}
      {attempts > 0 && (
        <p style={{ marginTop: "0.5rem" }}>Attempts: {attempts}</p>
      )}

      {/* Clear button */}
      <button onClick={handleClear} disabled={unlocked}>
        Clear Guess
      </button>

      {/* Swatches */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 2rem)",
          gap: "1rem",
          marginTop: "1rem",
        }}
      >
        {allColors.map((color) => (
          <button
            key={color}
            onClick={() => handleSwatchClick(color)}
            role="button"
            aria-label={color}
            style={{
              width: "2rem",
              height: "2rem",
              backgroundColor: color,
              border: "2px solid #333",
              cursor: unlocked ? "default" : "pointer",
            }}
            disabled={unlocked}
          />
        ))}
      </div>
    </div>
  );
};
