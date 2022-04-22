import dedent from "dedent";
import { joinGroup } from "./utils";

const basic = dedent`
  .overflow-hidden {
    overflow: hidden;
  }
  
  .overflow-scroll {
    overflow: scroll;
  }
`;

export const overflow = joinGroup((output) => {
  return output.push(basic);
});
