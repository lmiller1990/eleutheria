import { intArg, nonNull, objectType } from "nexus";
import path from "path";
import { ChartDataSource } from "../../sources/chartSource";
import { Chart } from "./gql-Chart";

export const Song = objectType({
  name: "Song",
  sourceType: {
    module: path.join(__dirname, "../../sources/songDataSource.ts"),
    export: "SongDataSource",
  },
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("title");
    t.nonNull.string("imgSrc");
    t.nonNull.string("duration");
    t.nonNull.string("artist");
    t.nonNull.float("bpm");
    t.float("best");

    t.nonNull.list.nonNull.field("charts", {
      type: Chart,
      resolve: async (source, args, ctx) => {
        return (await ctx.actions.db.getChartsForSong(source.id)).map((c) => {
          return new ChartDataSource(ctx, {
            ...c,
            bpm: source.bpm,
          });
        });
      },
    });
  },
});
