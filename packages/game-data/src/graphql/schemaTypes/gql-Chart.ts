import { objectType } from "nexus";
import { BaseNote } from "./gql-BaseNote";

export const Chart = objectType({
  name: "Chart",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("difficulty");
    t.nonNull.int("level");
    t.nonNull.list.field("parsedTapNoteChart", {
      type: BaseNote,
    });
  },
});
