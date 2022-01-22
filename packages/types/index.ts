/**
 * Represents an input from the user.
 * ms is the time of the input in millseconds since
 * the start of the game.
 * Code represents the key - this can be a virtual key, too.
 */
export interface Input {
  column: number;
  ms: number;
}

/**
 * Represents the abstract idea of a Note, for example in a note chart you load from a text file, etc.
 */
export interface BaseNote {
  /**
   * Just an id. Usually numeric, but it can be anything.
   */
  id: string;

  /**
   * ms from start of song given a constant bpm
   */
  ms: number;

  // 0, 1, 2, 3...
  columns: number[];

  /**
   * This note can only be hit if the note it dependsOn
   * has been hit, too. Useful for holds.
   * dependsOn will point to another BaseNote.id.
   */
  dependsOn?: string;
}

