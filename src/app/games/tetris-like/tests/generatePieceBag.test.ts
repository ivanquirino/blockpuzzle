import { generateRandomPieceSet } from "../game";
import { PieceId } from "../types";

describe("generateRandomPieceSet", () => {
  test("should generate a 7 piece Set (no repeated piece)", () => {
    const bag = generateRandomPieceSet();

    expect(bag).toBeInstanceOf(Set);
    expect(bag.size).toBe(7);

    for (let i = 1; i <= 7; i++) {
      expect(bag.has(i as PieceId));
    }
  });
});
