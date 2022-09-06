import { Request, Response } from "express";
import { graphqlHTTP } from "express-graphql";
import { Context } from "./graphql/context";
import { graphqlSchema } from "./graphql/schema";

export function createGraphQL() {
  console.log('Create')
  // @ts-ignore
}
