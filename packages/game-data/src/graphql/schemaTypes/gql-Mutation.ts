import type { SummaryData } from "@packages/engine";
import { intArg, mutationType, nonNull, stringArg } from "nexus";
import { debug } from "../../../util/debug";
import { SaveScoreInputType } from "../inputObjectTypes";
import { Query } from "./gql-Query";
import { Summary } from "./gql-Summary";

const log = debug("game-data:gql-Mutation");

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

    t.field("startEditing", {
      type: "String",
      description:
        "Set a chart you would like to edit. It will write it to a local text file",
      args: {
        chartId: nonNull(intArg()),
      },
      resolve: async (_src, args, ctx) => {
        await ctx.actions.editor.copyChartToFile(args.chartId);
        return "OK";
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

    t.field("saveScore", {
      type: Summary,
      args: {
        data: nonNull(SaveScoreInputType),
      },
      resolve: async (_source, args, ctx) => {
        const data: SummaryData = {
          tapNotes: args.data.tapNotes,
          holdNotes: args.data.holdNotes,
        };
        const score = await ctx.actions.gameplay.saveScore(
          data,
          args.data.chartId
        );
        log(`returning`, score);
        return score;
      },
    });
  },
});
