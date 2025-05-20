import { describe, expect, it } from "vitest";
import { checkCombination } from "../components/Safe";

describe("Safe puzzle – checkCombination()", () => {
  const SECRET = "1234";

  it("returns true for the correct combination", () => {
    expect(checkCombination(SECRET)).toBe(true);
  });

  it("returns false for wrong codes of same length", () => {
    expect(checkCombination("0000")).toBe(false);
    expect(checkCombination("4321")).toBe(false);
  });

  it("returns false for codes of incorrect length", () => {
    expect(checkCombination("123")).toBe(false);
    expect(checkCombination("12345")).toBe(false);
  });

  it("returns false if non-digit characters are present", () => {
    expect(checkCombination("12a4")).toBe(false);
    expect(checkCombination("!@#$")).toBe(false);
  });

  it("allows changing the secret via the second argument", () => {
    expect(checkCombination("0000", "0000")).toBe(true);
    expect(checkCombination("0001", "0000")).toBe(false);
  });
});
