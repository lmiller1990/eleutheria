import { StartGameArgs } from "../../gameplay";

export interface GameplayProps {
  startGameArgs: Omit<StartGameArgs, "updateSummary">;
  __testingDoNotStartSong?: boolean;
  __testingManualMode?: boolean;
}
