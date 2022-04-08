import { flex } from "./flex";
import { grid } from "./grid";
import { padding } from "./padding";
import { margin } from "./margin";
import { border } from "./border";
import { widthHeight } from "./widthHeight";
import { misc } from "./misc";

export const style = [
  flex,
  padding,
  margin,
  grid,
  border,
  widthHeight,
  misc,
].join("\n\n");
