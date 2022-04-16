import dedent from "dedent";
import { joinGroup } from "./utils";

const _opacity = joinGroup((output) => {
  for (let i = 0; i < 10; i++) {
    output.push(dedent`
      .opacity-${i} {
        opacity: 0.${i};
      }
    `);
  }
});

export const opacity = joinGroup((output => {
  output.push(_opacity)
}))