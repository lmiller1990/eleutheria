import { objectType } from "nexus";
import { CreatorSocial } from "./gql-CreatorSocial";

export const Creator = objectType({
  name: "Creator",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("name", {
      description: "Name of creator",
    });
    t.nonNull.list.nonNull.field("socials", {
      type: CreatorSocial,
    });
  },
});
