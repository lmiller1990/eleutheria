import dedent from "dedent";
import { joinGroup } from "./utils";

const nums = Array(10)
  .fill(null)
  .map((_, idx) => 100 - idx * 10);

function generateWidthHeight() {
  let output: string[] = [];
  for (const num of nums) {
    for (const dir of ["width", "height"] as const) {
      const sym = dir.slice(0, 1);
      output.push(dedent`
      .${sym}-${num} {
        ${dir}: ${num}%; 
      }
    `);
    }
  }
  return output.join("\n\n");
}

const _maxWidths = new Map([
  ["s", 480],
  ["m", 768],
  ["l", 1024],
]);

export const maxWidth = Array.from(_maxWidths.entries())
  .map((width) => {
    return joinGroup((output) => {
      output.push(
        dedent`
        .max-w-${width[0]} {
          max-width: ${width[1]}px;
        }
      `
      );
    });
  })
  .join("\n\n");

export const widthHeight = generateWidthHeight();
