import type { NoteSkin } from "@packages/types/src";
import { CoverParams } from "../../screens/gameplay/modiferManager";
import type { ScrollDirection } from "../../screens/gameplay/types";

export interface ModifierPanelProps {
  currentSpeed: number;
  currentScroll: ScrollDirection;
  // Array of stylesheets.
  notes: NoteSkin[];
}

export type ModCoverParams = Pick<CoverParams, "id" | "style" | "visible">;
