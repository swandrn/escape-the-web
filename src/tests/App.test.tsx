/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock SafePuzzle and HiddenWordPuzzle to simple finish buttons
vi.mock("../components/SafePuzzle", () => ({
  SafePuzzle: (props: { onSuccess: () => void }) => (
    <button onClick={props.onSuccess}>Finish Safe</button>
  ),
}));
vi.mock("../components/HiddenWordPuzzle", () => ({
  HiddenWordPuzzle: (props: { onSuccess: () => void }) => (
    <button onClick={props.onSuccess}>Finish Hidden</button>
  ),
}));

import App from "../App";

describe("<App /> – solved-state nav disabling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initially enables both puzzle nav buttons", () => {
    render(<App />);

    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });

    expect(safeNav).toBeEnabled();
    expect(hiddenNav).toBeEnabled();

    // SafePuzzle is showing
    expect(screen.getByText("Finish Safe")).toBeInTheDocument();
  });

  it("disables Safe Puzzle nav after solving SafePuzzle and shows HiddenWordPuzzle", () => {
    render(<App />);

    // Solve the Safe puzzle
    fireEvent.click(screen.getByText("Finish Safe"));

    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });

    // Safe nav should now be permanently disabled
    expect(safeNav).toBeDisabled();
    // Hidden nav stays enabled so we can access next puzzle
    expect(hiddenNav).toBeEnabled();

    // HiddenWordPuzzle is now showing
    expect(screen.getByText("Finish Hidden")).toBeInTheDocument();
  });

  it("prevents re-clicking the disabled Safe Puzzle nav", () => {
    render(<App />);

    // Solve Safe
    fireEvent.click(screen.getByText("Finish Safe"));

    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    // Attempting to click should do nothing
    fireEvent.click(safeNav);

    // Still in HiddenWordPuzzle
    expect(screen.getByText("Finish Hidden")).toBeInTheDocument();
  });

  it("disables both nav buttons after solving HiddenWordPuzzle and shows fallback", () => {
    render(<App />);

    // Solve Safe → now in HiddenWordPuzzle
    fireEvent.click(screen.getByText("Finish Safe"));
    // Solve Hidden
    fireEvent.click(screen.getByText("Finish Hidden"));

    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });

    // Both puzzles are solved: both nav buttons disabled
    expect(safeNav).toBeDisabled();
    expect(hiddenNav).toBeDisabled();

    // Fallback view is shown
    expect(
      screen.getByText(/All puzzles complete!/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Feel free to reload to start over\./i),
    ).toBeInTheDocument();
  });
});
