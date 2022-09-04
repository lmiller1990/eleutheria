import path from "path";
import { makeSchema } from "nexus";
import * as schemaTypes from "./schemaTypes";

export const graphqlSchema = makeSchema({
  types: [schemaTypes],
  shouldGenerateArtifacts: true,
  shouldExitAfterGenerateArtifacts: Boolean(process.env.GRAPHQL_CODEGEN),
  outputs: {
    typegen: path.join(__dirname, "gen/nxs.gen.ts"),
    schema: path.join(__dirname, "schema.graphql"),
  },
  contextType: {
    module: path.join(__dirname, "./context.ts"),
    export: "Context",
  },
});
