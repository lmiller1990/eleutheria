import type { BaseSong } from "@packages/types";

export interface Song extends BaseSong {
  order: number;
  banner: string;
}
