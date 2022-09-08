import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { COOKIE } from "../../";
import { knex } from "../knex";

declare global {
  namespace Express {
    interface Request {
      session: {
        id: string;
      };
    }
  }
}

export async function sessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.header("X-NO-SESSION")) {
    return next();
  }
  const sessionId = req.cookies[COOKIE];
  if (sessionId) {
    await knex<{ id: string }>("sessions").where("id", sessionId).first();
    req.session = { id: sessionId };
    return next();
  }

  const id = randomUUID();
  await knex("sessions").insert({ id: id });
  req.session = { id };
  res.cookie(COOKIE, id);

  next();
}
