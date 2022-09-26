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

    t.nonNull.string("percent", {
      description: "Percentage score out of 100",
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
