import { objectType } from "nexus";

export const BaseNote = objectType({
  name: "BaseNote",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("char");
    t.nonNull.int("column");
    t.nonNull.float("ms");
    t.nonNull.int("measureNumber");
  },
});
