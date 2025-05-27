/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ColorOrderPuzzle } from "../components/ColorOrderPuzzle";

describe("<ColorOrderPuzzle />", () => {
  const secret = ["blue", "red", "yellow"];
  let onSuccess: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSuccess = vi.fn();
    render(<ColorOrderPuzzle secret={secret} onSuccess={onSuccess} />);
  });

  it("renders the riddle and eight color swatches", () => {
    // Riddle text
    expect(
      screen.getByText(/first the calm before the storm/i),
    ).toBeInTheDocument();

    // Expect exactly 8 swatches (buttons or divs with role="button")
    const swatches = screen.getAllByRole("button", {
      name: /^(blue|red|yellow|green|orange|purple|black|white)$/i,
    });
    expect(swatches).toHaveLength(8);

    // Clear button is present
    expect(screen.getByRole("button", { name: /clear guess/i }))
      .toBeInTheDocument();
  });

  it("builds the guess as chips when swatches are clicked", () => {
    // Click blue then red
    fireEvent.click(screen.getByRole("button", { name: /blue/i }));
    fireEvent.click(screen.getByRole("button", { name: /red/i }));

    // Now two chips should appear
    const chips = screen.getAllByTestId("guess-chip");
    expect(chips).toHaveLength(2);
    expect(chips[0]).toHaveTextContent(/blue/i);
    expect(chips[1]).toHaveTextContent(/red/i);
  });

  it("clears the current guess when Clear button is clicked", () => {
    // Click two swatches
    fireEvent.click(screen.getByRole("button", { name: /blue/i }));
    fireEvent.click(screen.getByRole("button", { name: /red/i }));

    // Clear the guess
    fireEvent.click(screen.getByRole("button", { name: /clear guess/i }));

    // No chips should remain
    expect(screen.queryAllByTestId("guess-chip")).toHaveLength(0);
  });

  it("auto-submits on third click and shows error on wrong sequence", () => {
    // Wrong third click (blue, red, green)
    fireEvent.click(screen.getByRole("button", { name: /blue/i }));
    fireEvent.click(screen.getByRole("button", { name: /red/i }));
    fireEvent.click(screen.getByRole("button", { name: /green/i }));

    // Error message appears
    expect(
      screen.getByText(/that's not quite right—try again!/i),
    ).toBeInTheDocument();

    // onSuccess should NOT have been called
    expect(onSuccess).not.toHaveBeenCalled();

    // Guess should have been reset (no chips)
    expect(screen.queryAllByTestId("guess-chip")).toHaveLength(0);

    // Attempts counter should read "Attempts: 1"
    expect(
      screen.getByText(/attempts:\s*1/i),
    ).toBeInTheDocument();
  });

  it("calls onSuccess and shows success message on correct sequence", () => {
    // Correct sequence: blue, red, yellow
    fireEvent.click(screen.getByRole("button", { name: /blue/i }));
    fireEvent.click(screen.getByRole("button", { name: /red/i }));
    fireEvent.click(screen.getByRole("button", { name: /yellow/i }));

    // onSuccess called once
    expect(onSuccess).toHaveBeenCalledTimes(1);

    // Success message displayed
    expect(
      screen.getByText(/✅ Colors in order!/i),
    ).toBeInTheDocument();

    // Guess chips should no longer be visible
    expect(screen.queryAllByTestId("guess-chip")).toHaveLength(0);
  });
});
