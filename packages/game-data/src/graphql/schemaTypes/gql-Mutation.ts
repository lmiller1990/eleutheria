import { mutationType, nonNull, stringArg } from "nexus";

export const mutation = mutationType({
  definition(t) {
    t.field('ok', {
      type: "String",
      resolve: (_, __, ctx) => {
        return 'OK'
      }
    })

    t.field("signUp", {
      type: "Boolean",
      description: "Sign up using email and password",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_, args, ctx) => {
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
      resolve: async (_, args, ctx) => {
        return true;
      },
    });
  },
});
