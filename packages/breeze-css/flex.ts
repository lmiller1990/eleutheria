import dedent from "dedent";

export const flex = dedent`
  .flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .space-between {
    justify-content: space-between;
  }

  .items-center {
    align-items: center;
  }

  .align-start {
    align-items: flex-start;
  }

  .align-end {
    align-items: flex-end;
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
