import { objectType } from "nexus";

export const Song = objectType({
  name: "Song",
  definition(t) {
    t.nonNull.string("id");
    t.nonNull.string("title");
    t.nonNull.string("imgSrc");
    t.nonNull.string("duration");
    t.nonNull.string("artist");
    t.nonNull.float("bpm");
    t.float("best");
  },
});
