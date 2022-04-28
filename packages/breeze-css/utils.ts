import dedent from "dedent";

export const sizes = new Map([
  ["s", 1],
  ["m", 1.5],
  ["l", 2],
]);

export function generate(type: "padding" | "margin") {
  let output: string[] = [];

  for (const [letter, num] of sizes) {
    /**
     * padding-s {
     *   padding: 2rem;
     * }
     */
    output.push(
      dedent`
      .${type}-${letter} {
        ${type}: ${num}rem !important;
      }
    `
    );
  }

  for (const unit of ["px", "rem"]) {
    for (const dir of ["top", "bottom", "left", "right"]) {
      for (let i = 0; i < 21; i++) {
        output.push(dedent`
          .${type}-${dir}-${i}${unit} {
            ${type}-${dir}: ${i}${unit} !important; 
          }`);
      }
    }

    for (let i = 0; i < 21; i++) {
      output.push(dedent`
        .${type}-${i}${unit} {
          ${type}: ${i}${unit} !important; 
        }`);
    }
  }

  for (const [letter, num] of sizes) {
    for (const dir of ["horizontal", "vertical"] as const) {
      const s = dir === "horizontal" ? `0 ${num}rem` : `${num}rem 0 !important`;

      output.push(dedent`
      .${type}-${dir}-${letter} {
        ${type}: ${s};
      }
    `);
    }
  }

  return output.join("\n\n");
}

export function joinGroup(fn: (output: string[]) => void) {
  let output: string[] = [];
  fn(output);
  return output.join("\n\n");
}
