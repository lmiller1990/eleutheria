import dedent from "dedent";
import { joinGroup, sizes } from "./utils";
import { allColors } from "./colors";

const rounded = joinGroup((output) => {
  for (const [letter, num] of sizes) {
    output.push(dedent`
      .rounded-border-${letter} {
        border-radius: ${num * 8}px;
      }
    `);
  }
});

const horizontalVertical = joinGroup((output) => {
  for (let i = 0; i < 5; i++) {
    output.push(dedent`
      .border-h-${i + 1} {
        border-left: ${(i + 1) * 2}px solid;
        border-right: ${(i + 1) * 2}px solid;
      }
    `);

    output.push(dedent`
      .border-v-${i + 1} {
        border-top: ${(i + 1) * 2}px solid;
        border-bottom: ${(i + 1) * 2}px solid;
      }
    `);

    output.push(dedent`
      .border-${i + 1} {
        border: ${(i + 1) * 2}px solid;
      }
    `);
  }
});

const color = joinGroup((output) => {
  for (const c of allColors) {
  for (let i = 0; i < 5; i++) {
    output.push(dedent`
      .border-${c.name}-${i + 1} {
        border-color: ${c.colors[i]};
      }
    `);
  }
  }
});

export const border = joinGroup((output) => {
  return output.push(rounded, horizontalVertical, color);
});
