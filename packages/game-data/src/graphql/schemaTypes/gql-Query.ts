import { objectType } from "nexus";
import { App } from "./gql-App";

export const Query = objectType({
  name: "Query",
  description:
    'The root "Query" type containing all entry fields for our querying',
  definition(t) {
    t.nonNull.field("app", {
      type: App,
      resolve: (_root, _args, ctx) => {
        return ctx.app;
      },
    });
  },
});
