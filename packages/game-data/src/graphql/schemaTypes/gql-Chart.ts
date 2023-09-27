import { objectType } from "nexus";
import { BaseNote } from "./gql-BaseNote";
import { Song } from "./gql-Song";
import path from "path";
import { Creator } from "./gql-Creator";

export const Chart = objectType({
  name: "Chart",
  sourceType: {
    module: path.join(__dirname, "../../sources/chartDataSource.ts"),
    export: "ChartDataSource",
  },
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("difficulty");
    t.nonNull.int("level");
    t.nonNull.int("tapNoteCount");
    t.float("worldRecord", {
      description: "World record for this chart",
      resolve: async (source, _args, ctx) => {
        const cds = await ctx.actions.db.queryForWorldRecord(source.data.id);
        return cds?.percent ?? null;
      },
    });
    t.float("personalBest", {
      description: "Personal best score on this chart",
      resolve: async (source, _args, ctx) => {
        const user = await ctx.queryForCurrentUser();

        if (!user) {
          return null;
        }

        const cds = await ctx.actions.db.queryForUserPersonalBest(
          source.data.id,
          user.id
        );

        return cds?.percent ?? null;
      },
    });

    t.nonNull.int("offset", {
      description: "Delay between notes and audio. Inherited from song.",
    });
    t.nonNull.list.nonNull.field("parsedTapNoteChart", {
      type: BaseNote,
    });
    t.nonNull.field("song", {
      type: Song,
    });

    t.nonNull.field("creator", {
      type: Creator,
    });
  },
});
