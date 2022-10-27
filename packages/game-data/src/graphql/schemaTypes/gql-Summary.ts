import { objectType } from "nexus";
import path from "path";
import { Chart } from "./gql-Chart";

export const Summary = objectType({
  name: "Summary",
  // `sourceType` is needed to ensure async fields on SourceDataSource map up correctly.
  // If you remove it, gql-Mutation#saveScore gives a TS error (but still works).
  sourceType: {
    module: path.join(__dirname, "../../sources/scoreDataSource.ts"),
    export: "ScoreDataSource",
  },
  definition(t) {
    t.nonNull.int("id");

    t.nonNull.float("percent", {
      description: "Percentage score out of 100",
    });

    t.float("worldRecord", {
      description:
        "Highest score ever achieved on this song, including guest scores. If there are multiple, the most recent is prioritized.",
      resolve: async (source, _args, ctx) => {
        const cds = await ctx.actions.db.queryForWorldRecord(
          source.data.chart_id
        );
        console.log(cds, source.data.chart_id);
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
          source.data.chart_id,
          user.id
        );

        return cds?.percent ?? null;
      },
    });

    t.nonNull.string("timing", {
      description:
        "timing result. It's a JSON object with the shape [timingWindow: string]: { early: number, late: number, count: number }",
    });

    t.nonNull.field("chart", {
      type: Chart,
      description: "Chart for which this score was achieved on",
    });
  },
});
