import dedent from "dedent";

const basic = dedent`
  .upcase {
    text-transform: uppercase;
  }
  
  .caps {
    text-transform: capitalize;
  }
`

export const typography = [basic].join("\n\n")