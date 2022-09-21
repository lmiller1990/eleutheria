import { inputObjectType, objectType } from "nexus";

export const SummaryNote = inputObjectType({
  name: "SummaryNote",
  definition(t) {
    t.nonNull.string("id");

    t.nonNull.boolean("missed");
    t.float("hitAt");
    t.nonNull.float("ms");

    t.string("timingWindowName");
    t.float("droppedAt");
  },
});
