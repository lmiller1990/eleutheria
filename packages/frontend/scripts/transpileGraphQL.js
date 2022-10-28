// @ts-check
const typescript = require("typescript");
const path = require("node:path");
const fs = require("fs-extra");

async function main() {
  const schema = await fs.readFile(
    path.join(__dirname, "..", "src", "generated", "graphql.ts"),
    "utf8"
  );

  const result = typescript.transpileModule(schema, {});

  await fs.writeFile(
    path.join("src", "generated", "graphql.js"),
    result.outputText
  );

  console.log("✅ Generated graphql.js");
}

main();
