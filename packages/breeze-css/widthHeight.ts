import dedent from "dedent";

const nums = Array(10)
  .fill(null)
  .map((_, idx) => 100 - idx * 10);

function generateWidthHeight() {
  let output: string[] = [];
  for (const num of nums) {
    for (const dir of ["width", "height"] as const) {
      const sym = dir.slice(0, 1);
      output.push(dedent`
      .${sym}-${num} {
        ${dir}: ${num}%; 
      }
    `);
    }
  }
  return output.join("\n\n");
}

export const widthHeight = generateWidthHeight();
