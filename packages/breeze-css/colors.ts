import dedent from "dedent";
import { joinGroup } from "./utils";

const red = {
  name: "red",
  colors: [
    "rgb(254 202 202)",
    "rgb(252 165 165)",
    "rgb(248 113 113)",
    "rgb(239 68 68)",
    "rgb(220 38 38)",
  ],
} as const;

const blue = {
  name: "blue",
  colors: [
    "rgb(186 230 253)",
    "rgb(125 211 252)",
    "rgb(56 189 248)",
    "rgb(14 165 233)",
    "rgb(2 132 199)",
  ],
} as const;

const green = {
  name: "green",
  colors: [
    "rgb(187 247 208)",
    "rgb(134 239 172)",
    "rgb(74 222 128)",
    "rgb(34 197 94)",
    "rgb(22 163 74)",
  ],
};

const all = [red, blue, green];

const _colors = all.map((col) => {
  return joinGroup((output) => {
    for (let i = 0; i < col.colors.length; i++) {
      output.push(
        dedent`
          .${col.name}-${i + 1} {
            background-color: ${col.colors[i]};
          }
      `
      );
    }
  });
});

export const colors = _colors.join("\n\n");
