import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SafePuzzle } from "../components/SafePuzzle";

describe("<SafePuzzle />", () => {
  const secret = "2468";
  const onSuccess = vi.fn();

  beforeEach(() => {
    onSuccess.mockReset();
  });

  it("always shows the riddle", () => {
    render(<SafePuzzle onSuccess={onSuccess} secret={secret} />);
    expect(screen.getByText(/climb, no tricks or sudden dips/i))
      .toBeInTheDocument();
  });

  it("increments attempt counter on each unlock click", () => {
    render(<SafePuzzle onSuccess={onSuccess} secret={secret} />);
    const input = screen.getByPlaceholderText("____");
    const button = screen.getByText(/unlock/i);

    // first wrong attempt
    fireEvent.change(input, { target: { value: "0000" } });
    fireEvent.click(button);
    expect(screen.getByText(/you've taken 1 attempt/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();

    // second wrong attempt
    fireEvent.change(input, { target: { value: "1111" } });
    fireEvent.click(button);
    expect(screen.getByText(/you've taken 2 attempts/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("shows success message and final count on correct code", () => {
    render(<SafePuzzle onSuccess={onSuccess} secret={secret} />);
    const input = screen.getByPlaceholderText("____");
    const button = screen.getByText(/unlock/i);

    // two wrongs, then one right
    fireEvent.click(button); // empty → wrong
    fireEvent.change(input, { target: { value: "1234" } });
    fireEvent.click(button); // still wrong
    fireEvent.change(input, { target: { value: secret } });
    fireEvent.click(button); // correct!

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/safe unlocked/i)).toBeInTheDocument();
    expect(screen.getByText(/You've taken 3 attempts/i)).toBeInTheDocument();
  });

  it("toggles hints panel", () => {
    render(<SafePuzzle onSuccess={onSuccess} secret={secret} />);
    const toggle = screen.getByText(/show more hints/i);
    expect(screen.queryByText(/the sum of my digits is 10/i)).toBeNull();

    fireEvent.click(toggle);
    expect(screen.getByText(/the sum of my digits is 10/i)).toBeInTheDocument();
    expect(toggle.textContent).toMatch(/hide hints/i);

    fireEvent.click(toggle);
    expect(screen.queryByText(/the sum of my digits is 10/i)).toBeNull();
    expect(toggle.textContent).toMatch(/show more hints/i);
  });
});
