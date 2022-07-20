import { describe, it, expect } from "vitest";
import { mergePreferences, Preferences } from "./preferences";

describe("preferences", () => {
  it("merges primitive", () => {
    const existing: Partial<Preferences> = {
      speedModifier: 1,
    };
    const actual = mergePreferences(existing, { speedModifier: 2 });

    expect(actual.speedModifier).toEqual(2);
  });

  it("merges an object deeply", () => {
    const existing: Partial<Preferences> = {
      cover: {
        style: "background: blue;",
        offset: 10,
      },
    };
    const actual = mergePreferences(existing, { cover: { offset: 20 } });

    expect(actual.cover).toEqual({
      style: "background: blue;",
      offset: 20,
    });
  });
});
