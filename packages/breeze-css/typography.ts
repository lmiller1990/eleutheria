import dedent from "dedent";
import { joinGroup } from "./utils";

const basic = dedent`
  .upcase {
    text-transform: uppercase;
  }
  
  .caps {
    text-transform: capitalize;
  }

  .align-center {
    text-align: center;
  }

  .align-left {
    text-align: left;
  }
`;

const sizes = joinGroup((output) => {
  for (let i = 0; i < 5; i++) {
    output.push(dedent`
      .font-${i + 1}rem {
        font-size: ${i + 1}rem;
      }
    `);
  }
});

export const typography = joinGroup((output) => {
  return output.push(basic, sizes);
});
