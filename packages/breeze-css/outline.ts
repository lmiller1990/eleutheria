import dedent from "dedent";
import { joinGroup } from "./utils";
import { allColors } from "./colors";

const nums = Array(20)
  .fill(null)
  .map((_, idx) => idx);

export const outline = joinGroup((output) => {
  const offsetFrom = (nums.length / 2) * -1;

  for (const { colors, name } of allColors) {
    for (let i = 0; i < colors.length; i++) {
      output.push(dedent`
      .outline-${name}-${i} {
        outline-color: ${colors[i]} !important;
      }
    `);
    }
  }

  for (const num of nums) {
    const offset = offsetFrom + num;
    output.push(dedent`
      .outline-${num}px {
        outline: ${num}px solid;
      }

      .outline-offset-\[${offset}px\] {
        outline-offset: ${offset}px;
      }`);
  }
});
