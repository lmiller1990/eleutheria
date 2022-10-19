import type { Request, Response } from "express";
import { describe, it, expect } from "vitest";
import { Scores } from "../../ dbschema";
import { DbActions } from "../../src/actions/db";
import { Context } from "../../src/graphql/context";

const createTextCtx = () => new Context({} as Request, {} as Response);

describe("chartDataSource", () => {
  describe("queryForUserPersonalBest", () => {
    it("gets personal best for a given user and chart", async () => {
      const ctx = createTextCtx();
      const actions = new DbActions(ctx);
      await ctx.knexTable("scores").delete();

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
});
