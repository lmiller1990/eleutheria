import { flex } from "./flex";
import { grid } from "./grid";
import { padding } from "./padding";
import { margin } from "./margin";
import { border } from "./border";
import { maxWidth, widthHeight } from "./widthHeight";
import { misc } from "./misc";
import { colors } from "./colors";
import { typography } from "./typography";

export const style = [
  flex,
  padding,
  margin,
  grid,
  border,
  widthHeight,
  misc,
  colors,
  typography,
  maxWidth
].join("\n\n");
