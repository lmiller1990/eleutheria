import type { NoteSkin } from "@packages/types/src";
import type { ScrollDirection } from "../../screens/gameplay/types";

export interface ModifierPanelProps {
  currentSpeed: number;
  currentScroll: ScrollDirection;
  // Array of stylesheets.
  notes: NoteSkin[];
}
