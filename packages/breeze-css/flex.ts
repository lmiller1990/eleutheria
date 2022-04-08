import dedent from "dedent";

export const flex = dedent`
  .flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .items-center {
    align-items: center;
  }

  .items-start {
    align-items: flex-start;
  }

  .flex-col {
    flex-direction: column;
  }

  .flex-grow {
    flex-grow: 1;
  }`;
