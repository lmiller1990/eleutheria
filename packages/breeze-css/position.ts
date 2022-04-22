import dedent from "dedent";
import { joinGroup } from "./utils";

const basic = dedent`
  .relative {
    position: relative;
  }
  
  .absolute {
    position: absolute;
  }
`;

export const position = joinGroup((output) => {
  return output.push(basic);
});
