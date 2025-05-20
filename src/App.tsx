import React, { useState } from "react";
import { SafePuzzle } from "./components/SafePuzzle";

function App() {
  const [stage, setStage] = useState<"safe" | "next">("safe");

  return (
    <div>
      {stage === "safe" && <SafePuzzle onSuccess={() => setStage("next")} />}
      {stage === "next" && (
        <div style={{ textAlign: "center", marginTop: "2rem" }}>
          <h1>🎉 On to Puzzle #2!</h1>
          {/* render puzzle #2 component here */}
        </div>
      )}
    </div>
  );
}

export default App;
