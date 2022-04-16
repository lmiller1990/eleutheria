import dedent from "dedent";
import { joinGroup } from "./utils";

const basic = dedent`
  .shadow {
    box-shadow: 3px 3px 0 0 black;
  }
`;

const _shadows = joinGroup((output) => {
  const r = (x: number) => x.toFixed(2);

  const floating = joinGroup((output) => {
    for (let _i = 0; _i < 5; _i++) {
      const i = (_i + 1) * 0.4;
      const s = _i + 1;
      const a = 0;
      const b = r(i / 5);
      const c = r(i);
      const d = r(i / 2.5);

      output.push(dedent`
        .floating-${s} {
          box-shadow: ${a}rem ${b}rem ${c}rem ${d}rem rgba(0, 0, 0, 0.25);
        }
      `);
    }
  });

  output.push(basic, floating);
});

const shadowsHorizontal = joinGroup((output) => {
  for (let i = 0; i < 5; i++) {
    output.push(dedent`
      .shadow-h-${i + 1} {
        box-shadow: 0px 0px 10px ${i * 3}px black;
      }
    `);

    output.push(dedent`
      .border-v-${i + 1} {
        border-top: ${(i + 1) * 2}px solid;
        border-bottom: ${(i + 1) * 2}px solid;
      }
    `);
  }
});

export const shadows = joinGroup((output => {
  output.push(_shadows, basic, shadowsHorizontal)
}))