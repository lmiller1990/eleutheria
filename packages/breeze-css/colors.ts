import dedent from "dedent";
import { joinGroup } from "./utils";

const red = {
  name: "red",
  colors: [
    "rgb(254, 202, 202)",
    "rgb(252, 165, 165)",
    "rgb(248, 113, 113)",
    "rgb(239, 68, 68)",
    "rgb(220, 38, 38)",
  ],
} as const;

const blue = {
  name: "blue",
  colors: [
    "rgb(186, 230, 253)",
    "rgb(125, 211, 252)",
    "rgb(56, 189, 248)",
    "rgb(14, 165, 233)",
    "rgb(2, 132, 199)",
  ],
} as const;

const yellow = {
  name: "yellow",
  colors: [
    "rgb(254, 249, 195)",
    "rgb(254, 240, 138)",
    "rgb(253, 224, 71)",
    "rgb(250, 204, 21)",
    "rgb(234, 179, 8)",
  ],
};

const gray = {
  name: "gray",
  colors: [
    "rgb(229, 231, 235)",
    "rgb(209, 213, 219)",
    "rgb(156, 163, 175)",
    "rgb(107, 114, 128)",
    "rgb(75, 85, 99)",
    "rgb(58, 79, 90)"
  ],
};

const green = {
  name: "green",
  colors: [
    "rgb(187, 247, 208)",
    "rgb(134, 239, 172)",
    "rgb(74, 222, 128)",
    "rgb(34, 197, 94)",
    "rgb(22, 163, 74)",
  ],
};

const indigo = {
  name: "indigo",
  colors: [
    "rgb(225 146 255)",
    "rgb(176 29 169)",
    "rgb(170 113 192)",
    "rgb(149 95 169)",
    "rgb(126 65 149)",
  ],
};

export const allColors = [red, blue, green, gray, yellow, indigo];

const _colors = allColors.map((col) => {
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
