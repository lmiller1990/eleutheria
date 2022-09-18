import { objectType } from "nexus";

export const BaseNote = objectType({
  name: "BaseNote",
  definition(t) {
    t.nonNull.id("id");
    t.nonNull.float("ms");
    t.nonNull.int("column");
  },
});

// export interface BaseNote {
//   id: string;
//   column: number;
//   char: string;
//   ms: number;
//   measureNumber: number;
// }
