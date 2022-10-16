import { objectType } from "nexus";
import { BaseNote } from "./gql-BaseNote";
import { Song } from "./gql-Song";
import path from "path";

export const Chart = objectType({
  name: "Chart",
  sourceType: {
    module: path.join(__dirname, "../../sources/chartDataSource.ts"),
    export: "SongDataSource",
  },
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
    t.nonNull.field("song", {
      type: Song,
    });
  },
});
