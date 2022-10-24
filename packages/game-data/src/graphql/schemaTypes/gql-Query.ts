import { intArg, nonNull, objectType } from "nexus";
import { SongDataSource } from "../../sources/songDataSource";
import { App } from "./gql-App";
import { Chart } from "./gql-Chart";
import { Cover } from "./gql-Cover";
import { NoteSkin } from "./gql-NoteSkin";
import { Song } from "./gql-Song";
import { Summary } from "./gql-Summary";
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

    t.nonNull.field("song", {
      type: Song,
      args: {
        songId: nonNull(intArg()),
      },
      description: "Look up a song by its ID",
      resolve: async (_root, args, ctx) => {
        const song: SongDataSource | undefined =
          await ctx.actions.db.queryForSong(args.songId);

        if (!song) {
          throw Error(`Song with id ${args.songId} not found`);
        }

        return song;
      },
    });

    t.nonNull.list.nonNull.field("songs", {
      type: Song,
      description: "Get a list of known songs",
      resolve: (_root, _args, ctx) => {
        return ctx.actions.db.queryForSongs();
      },
    });

    t.nonNull.list.nonNull.field("covers", {
      type: Cover,
      resolve: (_source, _args, ctx) => ctx.actions.db.queryForAllCovers(),
    });

    t.nonNull.list.nonNull.field("noteSkins", {
      type: NoteSkin,
      resolve: async (_source, _args, ctx) => {
        const res = await ctx.actions.db.queryForAllNoteSkins();
        return res.map((x) => ({ ...x, id: x.id.toString() }));
      },
    });

    t.nonNull.list.nonNull.field("charts", {
      type: Chart,
      args: {
        songId: nonNull(intArg()),
      },
      resolve: async (source, args, ctx) => {
        const song: SongDataSource | undefined =
          await ctx.actions.db.queryForSong(args.songId);

        if (!song) {
          throw Error(`Song with id ${args.songId} not found.`);
        }

        return ctx.actions.db.getChartsForSong(args.songId);
      },
    });

    t.field("summary", {
      type: Summary,
      description: "Fetch a summary by ID",
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_source, args, ctx) => {
        const score = await ctx.actions.db.queryForScore(args.id);
        return score ?? null;
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
