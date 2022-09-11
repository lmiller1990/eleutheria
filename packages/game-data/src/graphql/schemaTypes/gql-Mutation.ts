import { mutationType, nonNull, stringArg } from "nexus";

export const mutation = mutationType({
  definition(t) {
    t.field("ok", {
      type: "String",
      resolve: () => {
        return "OK";
      },
    });

    t.field("signUp", {
      type: "Boolean",
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
        return true;
      },
    });

    t.field("signIn", {
      type: "Boolean",
      description: "Sign in using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, _ctx) => {
        await _ctx.actions.db.signIn(args.email, args.password);
        return true;
      },
    });
  },
});
