/**
 * @vitest-environment jsdom
 */
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HiddenWordPuzzle } from "../components/HiddenWordPuzzle";

describe("<HiddenWordPuzzle />", () => {
  const secret = "REACT";
  let onSuccess: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onSuccess = vi.fn();
  });

  it("renders a riddle and the masked scramble for the secret", () => {
    render(<HiddenWordPuzzle secret={secret} onSuccess={onSuccess} />);

    expect(
      screen.getByText(/web uis with components and hooks/i),
    ).toBeInTheDocument();

    expect(screen.getByText(/^R\s*_\s*_\s*_\s*T$/)).toBeInTheDocument();

    const letters: string[] = ["A", "C", "E"];
    letters.forEach((letter) => {
      expect(
        screen.getByText(new RegExp(`\\b${letter}\\b`)),
      ).toBeInTheDocument();
    });
  });

  it("displays an error and does NOT call onSuccess for a wrong guess", () => {
    render(<HiddenWordPuzzle secret={secret} onSuccess={onSuccess} />);

    const input = screen.getByRole("textbox");
    const submit = screen.getByRole("button", { name: /submit guess/i });

    fireEvent.change(input, { target: { value: "WRONG" } });
    fireEvent.click(submit);

    expect(
      screen.getByText(/not quite.*try again/i),
    ).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("calls onSuccess and shows success message for the correct guess (case-insensitive)", () => {
    render(<HiddenWordPuzzle secret={secret} onSuccess={onSuccess} />);

    const input = screen.getByRole("textbox");
    const submit = screen.getByRole("button", { name: /submit guess/i });

    fireEvent.change(input, { target: { value: "react" } });
    fireEvent.click(submit);

    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(
      screen.getByText(/✅.*guessed it/i),
    ).toBeInTheDocument();
  });
});
