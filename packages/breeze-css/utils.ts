import dedent from "dedent";

export const sizes = new Map([
  ["s", 1],
  ["m", 1.5],
  ["l", 2],
]);

export function generate(type: "padding" | "margin") {
  let output: string[] = [];

  for (const [letter, num] of sizes) {
    output.push(
      dedent`
      .${type}-${letter} {
        ${type}: ${num}rem;
      }
    `
    );
  }

  for (const [letter, num] of sizes) {
    for (const dir of ["horizontal", "vertical"] as const) {
      const s = dir === "horizontal" ? `0 ${num}rem` : `${num}rem 0`;

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
  fn(output)
  return output.join("\n\n");
}
