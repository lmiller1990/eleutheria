import { nonNull, objectType, stringArg } from "nexus";
import path from "path";
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
    t.nonNull.string("file", {
      description: "Music file (eg, mp3 or wav) for this song",
    });
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
      resolve: (source, _args, ctx) => {
        return ctx.actions.db.getChartsForSong(source.id);
      },
    });
  },
});
