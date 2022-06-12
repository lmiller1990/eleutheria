import dedent from "dedent";

export const flex = dedent`
  .flex {
    display: flex;
  }

  .justify-center {
    justify-content: center;
  }

  .justify-end {
    justify-content: flex-end;
  }

  .space-between {
    justify-content: space-between;
  }

  .space-around {
    justify-content: space-around;
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
