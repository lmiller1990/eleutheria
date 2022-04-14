import { flex } from "./flex";
import { grid } from "./grid";
import { padding } from "./padding";
import { margin } from "./margin";
import { border } from "./border";
import { maxWidth, widthHeight } from "./widthHeight";
import { misc } from "./misc";
import { colors } from "./colors";
import { typography } from "./typography";
import { shadows } from "./boxShadow";

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
  maxWidth,
  shadows,
].join("\n\n");
