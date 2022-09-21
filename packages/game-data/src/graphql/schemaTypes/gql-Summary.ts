import { objectType } from "nexus";

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
  },
});
