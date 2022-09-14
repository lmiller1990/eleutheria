import { mutationType, nonNull, stringArg } from "nexus";
import { Query } from "./gql-Query";

export const mutation = mutationType({
  definition(t) {
    t.field("ok", {
      type: "String",
      resolve: () => {
        return "OK";
      },
    });

    t.field("signUp", {
      type: Query,
      description: "Sign up using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        username: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
        await ctx.actions.db.createUser({
          email: args.email,
          password: args.password,
          username: args.username,
        });
        return ctx;
      },
    });

    t.field("signIn", {
      type: Query,
      description: "Sign in using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, _ctx) => {
        await _ctx.actions.db.signIn(args.email, args.password);
        return _ctx;
      },
    });

    t.field("signOut", {
      type: Query,
      description: "Sign out current user",
      resolve: async (_, _args, _ctx) => {
        await _ctx.actions.db.signOut();
        return _ctx;
      },
    });
  },
});
