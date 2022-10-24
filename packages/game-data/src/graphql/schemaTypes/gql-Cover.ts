import { objectType } from "nexus";

export const Cover = objectType({
  name: "Cover",
  description: "styles for cover",
  definition(t) {
    t.nonNull.id("id");

    t.nonNull.string("name", {
      description: "identifier for cover",
    });

    t.nonNull.string("css", {
      description: "custom css to inject for cover when game starts",
    });

    t.nonNull.string("code", {
      description: "code executed when game is started",
    });

    t.nonNull.string("thumbnailColor", {
      description: "background color",
    });
  },
});
