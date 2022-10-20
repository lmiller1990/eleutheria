import type { Request, Response } from "express";
import { describe, it, expect, beforeEach } from "vitest";
import { Scores } from "../../ dbschema";
import { DbActions } from "../../src/actions/db";
import { Context } from "../../src/graphql/context";

const createTextCtx = () => new Context({} as Request, {} as Response);

describe("db", () => {
  let ctx: Context;
  let actions: DbActions;

  beforeEach(async () => {
    ctx = createTextCtx();
    actions = new DbActions(ctx);

    await ctx.knexTable("scores").delete();
    await ctx.knexTable("users").delete().where("id", 2);
    await ctx.knexTable("users").insert({
      id: 2,
      email: "test@test",
      password: "test",
      username: "test_user",
    });
  });

  describe("queryForUserPersonalBest", () => {
    it("gets personal best for a given user and chart", async () => {
      const data: Omit<Scores, "id"> = {
        percent: "90.00",
        timing: {},
        chart_id: 1,
        user_id: 1,
      };

      await Promise.all([
        ctx.knexTable("scores").insert({ ...data, percent: "90.00" }),
        ctx.knexTable("scores").insert({ ...data, percent: "95.55" }),
        ctx.knexTable("scores").insert({ ...data, percent: "100.00" }),
      ]);

      const result = await actions.queryForUserPersonalBest(1, 1);

      expect(result?.percent).toEqual("100.00");
    });
  });

  describe("queryForWorldRecord", () => {
    it.only("gets world record for given chart", async () => {
      const data: Omit<Scores, "id"> = {
        percent: "80.00",
        timing: {},
        chart_id: 1,
        user_id: 1,
      };

      await ctx.knexTable("scores").insert({
        ...data,
        user_id: 1,
        percent: "90.01",
        created_at: "2020-10-10 11:00:50.000000+10",
      });

      await ctx.knexTable("scores").insert({
        ...data,
        user_id: 1,
        percent: "80.00",
        created_at: "2021-10-10 11:00:50.000000+10",
      });

      const [wr] = await ctx
        .knexTable("scores")
        .insert({
          ...data,
          user_id: 2,
          percent: "90.01",
          created_at: "2022-10-10 11:00:50.000000+10",
        })
        .returning("id");

      const result = await actions.queryForWorldRecord(1);

      expect(result?.id).toEqual(wr.id);
    });
  });
});
