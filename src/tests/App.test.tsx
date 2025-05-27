/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

// 1) Mock out the real SafePuzzle to a button that calls onSuccess
vi.mock("../components/SafePuzzle", () => ({
  SafePuzzle: (props: { onSuccess: () => void }) => (
    <button onClick={props.onSuccess}>Finish Safe</button>
  ),
}));

import App from "../App";

describe("<App />", () => {
  it("renders SafePuzzle by default", () => {
    render(<App />);
    // Our mock SafePuzzle renders a button "Finish Safe"
    expect(screen.getByText("Finish Safe")).toBeInTheDocument();
  });

  it("renders fallback when SafePuzzle calls onSuccess", () => {
    render(<App />);
    // Click the mock button to simulate solving the puzzle
    fireEvent.click(screen.getByText("Finish Safe"));
    // Now App should show the fallback view
    expect(
      screen.getByText(/select a puzzle to begin\./i),
    ).toBeInTheDocument();
    // And the mock button should be gone
    expect(screen.queryByText("Finish Safe")).toBeNull();
  });
});
