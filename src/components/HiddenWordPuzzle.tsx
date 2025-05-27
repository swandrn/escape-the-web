import React, { type FormEvent, useState } from "react";

interface HiddenWordPuzzleProps {
  secret: string;
  onSuccess: () => void;
}

export const HiddenWordPuzzle: React.FC<HiddenWordPuzzleProps> = ({
  secret,
  onSuccess,
}) => {
  const [guess, setGuess] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (guess.trim().toLowerCase() === secret.toLowerCase()) {
      setError(null);
      setUnlocked(true);
      onSuccess();
    } else {
      setError("Not quite—try again!");
    }
  };

  // Build masked pattern, e.g. "R _ _ _ T"
  const first = secret.charAt(0);
  const last = secret.charAt(secret.length - 1);
  const middleCount = Math.max(0, secret.length - 2);
  const masked = [first, ...Array(middleCount).fill("_"), last].join(" ");

  // Pool of middle letters
  const poolLetters = secret
    .slice(1, -1)
    .toUpperCase()
    .split("");

  return (
    <div>
      {/* Riddle */}
      <p>
        I power web UIs with components and hooks; Five letters name me—now
        shuffle my books.
      </p>

      {/* Masked scramble */}
      <p>{masked}</p>

      {/* Letter pool */}
      <div>
        {poolLetters.map((letter, i) => <span key={i}>{letter}</span>)}
      </div>

      {!unlocked
        ? (
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              role="textbox"
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
            />
            <button type="submit">Submit Guess</button>
            {error && <p>{error}</p>}
          </form>
        )
        : <p>✅ You've guessed it!</p>}
    </div>
  );
};
