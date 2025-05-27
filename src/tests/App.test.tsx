/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

// 1) Mock all three puzzles to simple buttons calling onSuccess
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
vi.mock("../components/ColorOrderPuzzle", () => ({
  ColorOrderPuzzle: (props: { onSuccess: () => void }) => (
    <button onClick={props.onSuccess}>Finish Color</button>
  ),
}));

import App from "../App";

describe("<App /> – navigation & solved‐state for all puzzles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    render(<App />);
  });

  it("renders all three nav buttons enabled and shows SafePuzzle by default", () => {
    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });
    const colorNav = screen.getByRole("button", { name: /Color Order/i });

    expect(safeNav).toBeEnabled();
    expect(hiddenNav).toBeEnabled();
    expect(colorNav).toBeEnabled();

    // SafePuzzle is active
    expect(screen.getByText("Finish Safe")).toBeInTheDocument();
    expect(screen.queryByText("Finish Hidden")).toBeNull();
    expect(screen.queryByText("Finish Color")).toBeNull();
  });

  it("disables Safe nav after solving SafePuzzle and shows HiddenWordPuzzle", () => {
    fireEvent.click(screen.getByText("Finish Safe"));

    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });
    const colorNav = screen.getByRole("button", { name: /Color Order/i });

    expect(safeNav).toBeDisabled();
    expect(hiddenNav).toBeEnabled();
    expect(colorNav).toBeEnabled();

    expect(screen.getByText("Finish Hidden")).toBeInTheDocument();
  });

  it("disables Hidden Word nav after solving HiddenWordPuzzle and shows ColorOrderPuzzle", () => {
    // Solve Safe → Hidden
    fireEvent.click(screen.getByText("Finish Safe"));
    // Solve Hidden → Color
    fireEvent.click(screen.getByText("Finish Hidden"));

    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });
    const colorNav = screen.getByRole("button", { name: /Color Order/i });

    expect(safeNav).toBeDisabled();
    expect(hiddenNav).toBeDisabled();
    expect(colorNav).toBeEnabled();

    expect(screen.getByText("Finish Color")).toBeInTheDocument();
  });

  it("prevents clicking disabled nav buttons", () => {
    // Solve Safe → Hidden
    fireEvent.click(screen.getByText("Finish Safe"));
    const safeNav = screen.getByRole("button", { name: /Safe Puzzle/i });
    fireEvent.click(safeNav);
    // Still on Hidden
    expect(screen.getByText("Finish Hidden")).toBeInTheDocument();

    // Solve Hidden → Color
    fireEvent.click(screen.getByText("Finish Hidden"));
    const hiddenNav = screen.getByRole("button", { name: /Hidden Word/i });
    fireEvent.click(hiddenNav);
    // Still on Color
    expect(screen.getByText("Finish Color")).toBeInTheDocument();
  });

  it("shows fallback after solving ColorOrderPuzzle", () => {
    // Solve all three
    fireEvent.click(screen.getByText("Finish Safe"));
    fireEvent.click(screen.getByText("Finish Hidden"));
    fireEvent.click(screen.getByText("Finish Color"));

    // All nav buttons disabled
    expect(screen.getByRole("button", { name: /Safe Puzzle/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Hidden Word/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Color Order/i })).toBeDisabled();

    // Fallback view appears
    expect(
      screen.getByText(/All puzzles complete!/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Feel free to reload to start over\./i),
    ).toBeInTheDocument();
  });
});
