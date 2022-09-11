import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "node:crypto";
import { COOKIE } from "../../";
import { knex } from "../knex";
import { debug } from "../../util/debug";

const log = debug("game-data:middleware");

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

  if (!sessionId) {
    const id = randomUUID();
    await knex("sessions").insert({ id: id });
    log(`no cookie, creating one with id ${id} and inserting.`);
    req.session = { id };
    res.cookie(COOKIE, id);

    return next();
  }

  const session = await knex<{ id: string }>("sessions")
    .where("id", sessionId)
    .first();

  log(`sessionId from cookie is ${sessionId} from ${req.url}`);

  if (sessionId && session) {
    log(`updating req.session with id ${sessionId}`);
    req.session = { id: sessionId };
    return next();
  }

  log(`got ${sessionId} but did not find associated cookie in db. Re-creating`);
  const id = randomUUID();
  await knex("sessions").insert({ id: id });
  req.session = { id };
  res.cookie(COOKIE, id);

  next();
}
