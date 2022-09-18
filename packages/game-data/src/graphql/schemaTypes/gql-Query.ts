import { intArg, nonNull, objectType } from "nexus";
import { ChartDataSource } from "../../sources/chartSource";
import { App } from "./gql-App";
import { Chart } from "./gql-Chart";
import { Song } from "./gql-Song";
import { Viewer } from "./gql-Viewer";

export const Query = objectType({
  name: "Query",
  description:
    'The root "Query" type containing all entry fields for our querying',
  definition(t) {
    t.field("viewer", {
      type: Viewer,
      resolve: (_root, _args, ctx) => {
        return ctx.viewer();
      },
    });

    t.nonNull.list.nonNull.field("songs", {
      type: Song,
      resolve: (_root, _args, ctx) => {
        return ctx.actions.db.queryForSongs();
      },
    });

    t.nonNull.list.nonNull.field("charts", {
      type: Chart,
      args: {
        songId: nonNull(intArg()),
      },
      resolve: async (source, args, ctx) => {
        const song = await ctx.actions.db.queryForSong(args.songId);

        if (!song) {
          throw Error(`Song with id ${args.songId} not found.`);
        }

        return (await ctx.actions.db.getChartsForSong(args.songId)).map((x) => {
          return new ChartDataSource(ctx, {
            ...x,
            bpm: song.bpm,
          });
        });
      },
    });

    t.nonNull.field("app", {
      type: App,
      resolve: (_root, _args, ctx) => {
        return ctx.app;
      },
    });
  },
});
