import { objectType } from "nexus";

export const NoteSkin = objectType({
  name: "NoteSkin",
  description: "skins for notes",
  definition(t) {
    t.nonNull.id("id");

    t.nonNull.string("name", {
      description: "identifier for note skin",
    });

    t.nonNull.string("css", {
      description: "custom styling in CSS for note skin",
    });
  },
});
