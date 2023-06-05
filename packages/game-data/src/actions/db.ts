import { Cover } from "@packages/shared";
import assert from "assert";
import {
  Charts,
  Covers,
  Creator,
  CreatorSocial,
  NoteSkins,
  Scores,
  Songs,
  Users,
} from "../../ dbschema";
import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import { knex, knexTable } from "../knex";
import { ChartDataSource } from "../sources/chartDataSource";
import { ScoreDataSource } from "../sources/scoreDataSource";
import { SongDataSource } from "../sources/songDataSource";
import { Auth } from "../models/auth";

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
        password: Auth.getHash(password),
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

  async getCreator(id: number) {
    const data = await knexTable("creator")
      .join("creator_social", "creator.id", "=", "creator_social.id")
      .where("creator.id", id);

    if (!data.length) {
      throw new Error(`Could not find creator with id ${id}`);
    }

    return {
      id: data[0].id,
      name: data[0].name,
      socials: data.map((x) => ({ social: x.social_name, link: x.link })),
    };
  }

  async signIn(email: string, plaintextPassword: string) {
    log(this.#ctx.req.session.id);

    const user = await this.findUserByEmail(email);

    if (!user) {
      throw Error(`User with email ${email} not found.`);
    }

    if (!Auth.compare(plaintextPassword, user.password)) {
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
    const charts: Array<Charts & Songs> = await knexTable("charts")
      .join("songs", "songs.id", "=", "charts.song_id")
      .where<Array<Charts & Songs>>("charts.song_id", songId)
      .select([
        "charts.id",
        "charts.level",
        "charts.notes",
        "charts.creator",
        "charts.difficulty",
        "charts.song_id",
        "songs.bpm",
        "songs.offset",
      ]);

    return charts
      .sort((x, y) => (y.level < x.level ? 1 : -1))
      .map((data) => {
        return new ChartDataSource(this.#ctx, data);
      });
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

  async queryForWorldRecord(
    chartId: number
  ): Promise<ScoreDataSource | undefined> {
    const subquery = await knexTable("scores")
      .where("scores.chart_id", chartId)
      .max<[{ max: number }]>(knex.raw("percent"))
      .returning("scores");

    const max = subquery[0].max;
    if (!max) {
      log(`no max found`);
      // No existing score found
      return;
    }

    const score = await knexTable("scores")
      .where<Scores>("scores.chart_id", chartId)
      .andWhere("scores.percent", "=", max)
      .orderBy("created_at", "desc")
      .first();

    log(`best score for chart_id ${chartId} is ${score?.percent}`);

    if (!score) {
      log(`no score found`);
      return undefined;
    }

    return new ScoreDataSource(this.#ctx, {
      ...score,
      timing: score.timing,
    });
  }

  async queryForUserPersonalBest(
    chartId: number,
    userId: number
  ): Promise<ScoreDataSource | undefined> {
    const score = await knexTable("scores")
      .where<Scores>("scores.chart_id", chartId)
      .andWhere<Scores>("scores.user_id", userId)
      .orderByRaw("scores.percent desc")
      .first();

    log(
      `best score for user_id ${userId} on chart_id ${chartId} is ${score?.percent}`
    );

    if (!score) {
      return undefined;
    }

    return new ScoreDataSource(this.#ctx, {
      ...score,
      timing: score.timing,
    });
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

  async queryForAllNoteSkins(): Promise<NoteSkins[]> {
    const skins = await knexTable<NoteSkins>("note_skins");
    log(`skins are ${skins}`);
    return skins;
  }

  async queryForAllCovers(): Promise<Cover[]> {
    const covers = await knexTable<Covers>("covers");
    log(`covers are ${covers}`);
    return covers.map((x) => ({
      ...x,
      id: x.id.toString(),
      thumbnailColor: x.thumbnail_color,
    }));
  }
}
