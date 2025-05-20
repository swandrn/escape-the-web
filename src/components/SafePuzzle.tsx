import React, { type FormEvent, useState } from "react";
import style from "../styles/SafePuzzle.module.css";
import { checkCombination } from "../utils/safe";

interface SafePuzzleProps {
  onSuccess: () => void;
  secret?: string;
}

export const SafePuzzle: React.FC<SafePuzzleProps> = ({
  onSuccess,
  secret = "1234",
}) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAttempts(attempts + 1);
    if (checkCombination(code, secret)) {
      setError(null);
      setUnlocked(true);
      onSuccess();
    } else {
      setError("Wrong code, try again!");
    }
  };

  return (
    <div className={style.container}>
      <h2 className={style.heading}>🔒 Enter the 4-digit code</h2>

      {/* Always-visible riddle */}
      <p className={style.riddle}>
        “I start at one and climb, no tricks or sudden dips. My first four steps
        are all you need to slip.”
      </p>

      {!unlocked
        ? (
          <form onSubmit={handleSubmit} className={style.form}>
            <input
              type="text"
              maxLength={secret.length}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="____"
              className={style.input}
            />
            <button type="submit" className={style.button}>
              Unlock
            </button>
            {error && <p className={style.error}>{error}</p>}
          </form>
        )
        : <p className={style.success}>✅ Safe unlocked!</p>}

      {/* Hint toggle */}
      {!unlocked && (
        <button
          onClick={() => setShowHints((v) => !v)}
          className={style.hintToggle}
        >
          {showHints ? "Hide hints" : "Show more hints"}
        </button>
      )}

      {showHints && !unlocked && (
        <div className={style.hints}>
          <p>The sum of my digits is 10.</p>
          <p>Each digit is exactly one greater than its predecessor.</p>
        </div>
      )}
      {attempts > 0 && (
        <div>
          <p>
            You've taken {attempts} {attempts === 1 ? "attempt" : "attempts"}.
          </p>
        </div>
      )}
    </div>
  );
};
