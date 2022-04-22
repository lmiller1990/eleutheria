import dedent from "dedent";
import { joinGroup } from "./utils";

const nums = Array(100)
  .fill(null)
  .map((_, idx) => idx);

export const zIndex = joinGroup((output) => {
  for (const num of nums) {
    output.push(dedent`
      .z-${num} {
        z-index: ${num};
      }`);
  }
});
