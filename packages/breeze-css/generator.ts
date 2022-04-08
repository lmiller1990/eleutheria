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
].join("\n");

// .w-100 {
//   width: 100%;
// }

// .h-100 {
//   height: 100%;
// }

// .d {
//   border: 1px solid red;
// }

// .padding-s {
//   padding: 12px;
// }
// .padding-m {
//   padding: 36px;
// }

// .margin-s {
//   margin: 12px;
// }
// .margin-m {
//   margin: 36px;
// }

// .margin-horizontal-s {
//   margin: 0 8px 0 8px;
// }
// .margin-vertical-s {
//   margin: 8px 0;
// }

// .padding-horizontal-s {
//   padding: 0 8px 0 8px;
// }
// .padding-vertical-s {
//   padding: 8px 0;
// }

// .rounded-border-s {
//   border-radius: 8px;
// }

// .grid {
//   display: grid;
// }
// .grid-row-gap-s {
//   grid-row-gap: 8px;
// }
// .grid-row-gap-m {
//   grid-row-gap: 16px;
// }

// .grid-col-gap-s {
//   grid-column-gap: 8px;
// }
// .grid-col-gap-m {
//   grid-column-gap: 16px;
// }

// .grid-cols-1fr-1fr {
//   grid-template-columns: 1fr 1fr;
// }

// .grid-rows-1fr-2fr {
//   grid-template-rows: 1fr 2fr;
// }

// .grid-rows-3 {
//   grid-template-rows: repeat(3, 1fr);
// }

// .grid-rows-10 {
//   grid-template-rows: repeat(10, 1fr);
// }
