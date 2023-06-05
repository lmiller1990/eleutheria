import { parseChart } from "@packages/chart-parser";
import assert from "assert";
import { Charts } from "../../ dbschema";
import { Context } from "../graphql/context";
import debugLib from "debug";

const debug = debugLib(`eleutheria:game-data:sources:chartDataSource`);

export interface ChartDataDefinition extends Charts {
  bpm: number;
  offset: number;
}

// TODO: Not a source?
export class ChartDataSource {
  #ctx: Context;
  data: ChartDataDefinition;

  constructor(ctx: Context, data: ChartDataDefinition) {
    debug("creating new ChartDataSource %o", data);
    this.#ctx = ctx;
    this.data = data;
  }

  get difficulty() {
    return this.data.difficulty;
  }

  get id() {
    return this.data.id;
  }

  get level() {
    return this.data.level;
  }

  get bpm() {
    return this.data.bpm;
  }

  get offset() {
    return this.data.offset;
  }

  tapNoteCount() {
    return this.parsedTapNoteChart.length;
  }

  get parsedTapNoteChart() {
    return parseChart({ bpm: this.bpm, offset: this.offset }, this.data.notes)
      .tapNotes;
  }

  async song() {
    assert(this.data.song_id, "chart must have a song_id");
    const song = await this.#ctx.actions.db.queryForSong(this.data.song_id);
    return song;
  }

  async creator() {
    return await this.#ctx.actions.db.getCreator(this.data.creator);
  }
}
