import { objectType } from "nexus";
import { App } from "./gql-App";
import { Song } from "./gql-Song";
import { Viewer } from "./gql-Viewer";

export const Query = objectType({
  name: "Query",
  description:
    'The root "Query" type containing all entry fields for our querying',
  definition(t) {
    t.field("viewer", {
      type: Viewer,
      resolve: (_root, _args, ctx) => {
        return ctx.viewer();
      },
    });

    t.nonNull.list.nonNull.field("songs", {
      type: Song,
      resolve: (_root, _args, ctx) => {
        return ctx.actions.db.queryForSongs();
      },
    });

    t.nonNull.field("app", {
      type: App,
      resolve: (_root, _args, ctx) => {
        return ctx.app;
      },
    });
  },
});
