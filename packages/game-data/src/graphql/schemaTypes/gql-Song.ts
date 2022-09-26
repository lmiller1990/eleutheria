import { intArg, nonNull, objectType, stringArg } from "nexus";
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
    t.nonNull.int("offset");
    t.nonNull.string("title");
    t.nonNull.string("imgSrc");
    t.nonNull.string("duration");
    t.nonNull.string("artist");
    t.nonNull.float("bpm");
    t.float("best");

    t.nonNull.field("chart", {
      type: Chart,
      args: {
        difficulty: nonNull(stringArg()),
      },
      resolve: async (source, args, ctx) => {
        const chart = (await ctx.actions.db.getChartsForSong(source.id)).find(
          (x) => x.difficulty === args.difficulty
        );

        if (!chart) {
          throw Error(
            `Could not find chart with difficulty ${args.difficulty}`
          );
        }

        return chart;
      },
    });

    t.nonNull.list.nonNull.field("charts", {
      type: Chart,
      resolve: (source, args, ctx) => {
        return ctx.actions.db.getChartsForSong(source.id);
        // return (await ctx.actions.db.getChartsForSong(source.id)).map((c) => {
        //   return new ChartDataSource(ctx, {
        //     ...c,
        //     bpm: source.bpm,
        //     offset: source.offset,
        //   });
        // });
      },
    });
  },
});
