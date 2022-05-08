import type { BaseSong } from "@packages/types/src";

export interface Song extends BaseSong {
  order: number;
  banner: string;
  key: string;
}

const T: Song = {}
