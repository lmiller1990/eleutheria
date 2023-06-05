import { objectType } from "nexus";

export const CreatorSocial = objectType({
  name: "CreatorSocial",

  definition(t) {
    t.nonNull.string("id", {
      description: "Link to social",
      resolve: (source, args, context) => {
        return source.link;
      },
    });
    t.nonNull.string("social", {
      description: "Social name, eg Twitter, YouTube etc",
    });
    t.nonNull.string("link", {
      description: "Link to social",
    });
  },
});
