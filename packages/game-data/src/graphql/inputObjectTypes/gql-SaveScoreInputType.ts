import { inputObjectType, list, nonNull } from "nexus";
import { SummaryNote } from "./gql-SummaryNote";

/**
 * Maps to EngineNote from `packages/engine`
 */
export const SaveScoreInputType = inputObjectType({
  name: "SaveScoreInputType",
  definition(t) {
    t.nonNull.int("chartId", {
      description: "Chart to associate with score",
    });

    t.nonNull.list.nonNull.field("tapNotes", {
      type: SummaryNote,
    });

    t.nonNull.list.nonNull.field("holdNotes", {
      type: list(nonNull(SummaryNote)),
    });
  },
});
