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
import { opacity } from "./opacity";
import { position } from "./position";
import { overflow } from "./overflow";
import { zIndex } from "./zIndex";
import { outline } from "./outline";

export const style = [
  flex,
  padding,
  margin,
  grid,
  zIndex,
  outline,
  overflow,
  border,
  widthHeight,
  misc,
  colors,
  typography,
  maxWidth,
  shadows,
  opacity,
  position,
].join("\n\n");
