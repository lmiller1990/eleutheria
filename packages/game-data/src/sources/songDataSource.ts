import { debug } from "../../util/debug";
import { Context } from "../graphql/context";

const log = debug(`game-data:songDataSource`);

export interface SongDataDefinition {
  id: number;
  title: string;
  imgSrc: string;
  duration: string;
  artist: string;
  bpm: number;
  file: string;
  banner_creator_id: number;
  offset: number;
  creator: number;
}

export class SongDataSource {
  #ctx: Context;
  data: SongDataDefinition;

  constructor(ctx: Context, data: SongDataDefinition) {
    log(`creating SongDataSource`, data);
    this.#ctx = ctx;
    this.data = data;
  }

  get id() {
    return this.data.id;
  }

  get title() {
    return this.data.title;
  }

  get imgSrc() {
    return this.data.imgSrc;
  }

  get duration() {
    return this.data.duration;
  }

  get artist() {
    return this.data.artist;
  }

  get bpm() {
    return this.data.bpm;
  }

  get offset() {
    return this.data.offset;
  }

  get file() {
    return this.data.file;
  }

  async charts() {
    return await this.#ctx.actions.db.getChartsForSong(this.id);
  }
}
