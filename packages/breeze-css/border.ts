import dedent from "dedent";
import { sizes } from "./utils";

function generateBorder() {
  let output: string[] = [];
  for (const [letter, num] of sizes) {
    output.push(dedent`
      .rounded-border-${letter} {
        border-radius: ${num * 8}px;
      }
    `);
  }
  return output.join("\n\n");
}

export const border = generateBorder();
