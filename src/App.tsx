import { useState } from "react";
import { SafePuzzle } from "./components/SafePuzzle";

export default function App() {
  const [currentPuzzle, setCurrentPuzzle] = useState<"safe" | "none">("none");

  return (
    <>
      {currentPuzzle === "safe" && (
        <SafePuzzle onSuccess={() => setCurrentPuzzle("none")} />
      )}
      {currentPuzzle === "none" && <p>Select a puzzle to begin.</p>}
    </>
  );
}
