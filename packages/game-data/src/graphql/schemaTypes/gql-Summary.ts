import { objectType } from "nexus";
import { Chart } from "./gql-Chart";

export const Summary = objectType({
  name: "Summary",
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
