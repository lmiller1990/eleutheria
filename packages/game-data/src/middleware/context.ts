import type { Request, Response, NextFunction } from "express";
import { Context } from "../graphql/context";

declare global {
  namespace Express {
    interface Request {
      ctx: Context;
    }
  }
}

export async function contextMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const context = new Context(req as Request, res as Response);
  req.ctx = context;
  next();
}
