import assert from "assert";
import { Charts, Scores, Songs, Users } from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { knexTable } from "../knex";
import { ChartDataSource } from "../sources/chartSource";
import { ScoreDataSource } from "../sources/scoreDataSource";
import { SongDataSource } from "../sources/songDataSource";

const log = debug(`game-data:db`);

export class DbActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  async createUser({
    username,
    email,
    password,
  }: {
    email: string;
    username: string;
    password: string;
  }): Promise<Users | undefined> {
    try {
      const user = await knexTable("users").insert<Users>({
        username,
        email,
        password,
      });
      log("created user", user);
      return user;
    } catch (e) {
      log("error creating user", e);
    }

    return;
  }

  async findUserByEmail(email: string) {
    const user = await knexTable("users").where<Users>("email", email).first();
    return user;
  }

  async signIn(email: string, password: string) {
    log(this.#ctx.req.session.id);

    const user = await this.findUserByEmail(email);

    if (!user || user.password !== password) {
      throw Error("Credentials do not match.");
    }

    await knexTable("sessions")
      .where({ id: this.#ctx.req.session.id })
      .update({ user_id: user.id });

    return user;
  }

  async queryForSong(songId: number): Promise<SongDataSource | undefined> {
    const song = await knexTable<Songs>("songs").where("id", songId).first();
    if (!song) {
      return;
    }
    return new SongDataSource(this.#ctx, {
      ...song,
      imgSrc: "",
    });
  }

  async queryForSongs(): Promise<SongDataSource[]> {
    const songs = await knexTable<Songs>("songs").select();
    return songs.map((song) => {
      return new SongDataSource(this.#ctx, {
        ...song,
        imgSrc: "",
      });
    });
  }

  async queryChartById(chartId: number): Promise<ChartDataSource | undefined> {
    const chart = await knexTable("charts")
      .join("songs", "songs.id", "=", "charts.song_id")
      .first()
      .where<Charts & Songs>("charts.id", chartId);

    if (!chart) {
      return;
    }
    return new ChartDataSource(this.#ctx, chart);
  }

  async getChartsForSong(songId: number): Promise<ChartDataSource[]> {
    const charts = await knexTable("charts")
      .join("songs", "songs.id", "=", "charts.song_id")
      .where<Array<Charts & Songs>>("charts.song_id", songId)
      .select([
        "charts.id",
        "charts.level",
        "charts.notes",
        "charts.difficulty",
        "charts.song_id",
        "songs.bpm",
        "songs.offset",
      ]);

    return charts.map((data) => new ChartDataSource(this.#ctx, data));
  }

  async signOut() {
    await knexTable("sessions")
      .where({ id: this.#ctx.req.session.id })
      .delete();

    log(`deleted session with id ${this.#ctx.req.session.id}`);
  }

  async queryForGuestUser(): Promise<Users> {
    const guest = await knexTable<Users>("users")
      .where("email", "guest@eleutheria")
      .andWhere("username", "guest")
      .andWhere("id", 1)
      .first();

    assert(
      guest,
      "expected guest user to exist with id=1, wasn't found. This should be scaffolded during the initial database setup."
    );

    return guest;
  }

  async queryForScore(id: number): Promise<ScoreDataSource | undefined> {
    const score = await knexTable("scores")
      .where<Scores>("scores.id", id)
      .first();

    if (!score) {
      return undefined;
    }

    return new ScoreDataSource(this.#ctx, {
      ...score,
      timing: score.timing,
    });
  }
}
