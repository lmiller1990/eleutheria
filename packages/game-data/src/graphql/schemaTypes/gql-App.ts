import { objectType } from "nexus";
import { Book } from "./gql-Book";

export const App = objectType({
  name: "App",
  definition(t) {
    t.nonNull.list.nonNull.field("books", {
      type: Book,
    });
  },
});
