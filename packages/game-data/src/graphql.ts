import { graphqlHTTP } from "express-graphql";
import { Context } from "./graphql/context";
import { graphqlSchema } from "./graphql/schema";

const context = new Context();

export function createGraphQL() {
  return graphqlHTTP(() => {
    return {
      schema: graphqlSchema,
      graphiql: true,
      context,
    };
  });
}
