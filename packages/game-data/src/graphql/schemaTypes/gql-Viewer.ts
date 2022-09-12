import { objectType } from "nexus";

export const Viewer = objectType({
  name: "Viewer",
  definition(t) {
    t.string("id");
    t.string("email");
    t.string("username");
  },
});
