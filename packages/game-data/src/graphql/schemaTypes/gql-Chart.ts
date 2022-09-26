import { objectType } from "nexus";
import { BaseNote } from "./gql-BaseNote";

export const Chart = objectType({
  name: "Chart",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("difficulty");
    t.nonNull.int("level");
    t.nonNull.int("tapNoteCount");
    t.nonNull.int("offset", {
      description: "Delay between notes and audio. Inherited from song.",
    });
    t.nonNull.list.nonNull.field("parsedTapNoteChart", {
      type: BaseNote,
    });
  },
});
