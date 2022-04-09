import dedent from "dedent";
import { sizes } from "./utils";

const basic = dedent`
  .grid {
    display: grid;
  }

  .grid-rows-1fr-2fr {
    grid-template-rows: 1fr 2fr;
  }

  .grid-columns-1fr-2fr {
    grid-template-columns: 1fr 2fr;
  }

`;

function gap(type: "row" | "column") {
  let output: string[] = [];

  for (const [letter, num] of sizes) {
    output.push(dedent`
      .grid-${type}-gap-${letter} {
        grid-${type}-gap: ${num}rem;
      }
    `);
  }

  return output.join("\n\n");
}

function templateRepeat(type: "rows" | "columns") {
  let output: string[] = [];

  for (let i = 0; i < 10; i++) {
    output.push(dedent`
      .grid-${type}-repeat-${i} {
        grid-template-${type}: repeat(${i}, 1fr);
      }
    `);
  }

  return output.join("\n\n");
}

// TODO: do we need this
function templateStatic(type: "rows" | "columns") {
  let output: string[] = [];

  for (let i = 0; i < 10; i++) {
    output.push(dedent`
      .grid-${type} {
        grid-template-${type}: repeat(${i}, 1fr);
      }
    `);
  }

  return output.join("\n\n");
}

export const grid = [
  basic,
  gap("row"),
  gap("column"),
  templateRepeat("rows"),
  templateRepeat("columns"),
].join("\n\n");
