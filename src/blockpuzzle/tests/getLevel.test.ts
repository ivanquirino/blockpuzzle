import { getScoreForNextLevel } from "../game";

describe("getLevel", () => {
  test("getScoreForNextLevel", () => {
    const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const scores = [
      1000, 3000, 6000, 10000, 15000, 21000, 28000, 36000, 45000, 55000,
    ];

    const expectedScores = levels.map(getScoreForNextLevel);

    expect(expectedScores).toEqual(scores);
  });
});
