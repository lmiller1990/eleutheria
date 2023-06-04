import { idArg, intArg, nonNull, objectType, stringArg } from "nexus";
import path from "path";
import { Chart } from "./gql-Chart";
import { Creator } from "./gql-Creator";

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
    t.nonNull.string("duration");
    t.nonNull.string("file", {
      description: "Music file (eg, mp3 or wav) for this song",
    });
    t.nonNull.string("artist");
    t.nonNull.float("bpm");
    t.float("best");

    t.nonNull.field("creator", {
      type: Creator,
      resolve: async (source, args, ctx) => {
        const data = await ctx.actions.db.getCreator(source.data.creator);
        return {
          id: data[0].id,
          name: data[0].name,
          socials: data.map((x) => ({ social: x.social_name, link: x.link })),
        };
      },
    });

    t.nonNull.field("chart", {
      type: Chart,
      args: {
        chartId: nonNull(intArg()),
      },
      resolve: async (source, args, ctx) => {
        const chart = (await ctx.actions.db.getChartsForSong(source.id)).find(
          (x) => x.id === args.chartId
        );

        if (!chart) {
          throw Error(`Could not find chart with id=${args.chartId}`);
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
