/* tslint:disable */
/* eslint-disable */

/**
 * AUTO-GENERATED FILE - DO NOT EDIT!
 *
 * This file was automatically generated by pg-to-ts v.4.1.0
 * $ pg-to-ts generate -c postgresql://username:password@localhost/eleutheria -t charts -t covers -t creator -t creator_social -t knex_migrations -t knex_migrations_lock -t note_skins -t scores -t sessions -t songs -t users -s public
 *
 */

export type Json = unknown;

// Table charts
export interface Charts {
  id: number;
  difficulty: string;
  level: number;
  notes: string;
  song_id: number;
  creator: number;
}
export interface ChartsInput {
  id: number;
  difficulty: string;
  level: number;
  notes?: string;
  song_id: number;
  creator: number;
}
const charts = {
  tableName: "charts",
  columns: ["id", "difficulty", "level", "notes", "song_id", "creator"],
  requiredForInsert: ["id", "difficulty", "level", "song_id", "creator"],
  primaryKey: null,
  foreignKeys: {
    song_id: { table: "songs", column: "id", $type: null as unknown as Songs },
  },
  $type: null as unknown as Charts,
  $input: null as unknown as ChartsInput,
} as const;

// Table covers
export interface Covers {
  id: number;
  name: string;
  thumbnail_color: string;
  css: string;
  code: string;
}
export interface CoversInput {
  id?: number;
  name: string;
  thumbnail_color: string;
  css?: string;
  code?: string;
}
const covers = {
  tableName: "covers",
  columns: ["id", "name", "thumbnail_color", "css", "code"],
  requiredForInsert: ["name", "thumbnail_color"],
  primaryKey: "id",
  foreignKeys: {},
  $type: null as unknown as Covers,
  $input: null as unknown as CoversInput,
} as const;

// Table creator
export interface Creator {
  id: number;
  name: string;
}
export interface CreatorInput {
  id?: number;
  name: string;
}
const creator = {
  tableName: "creator",
  columns: ["id", "name"],
  requiredForInsert: ["name"],
  primaryKey: "id",
  foreignKeys: {},
  $type: null as unknown as Creator,
  $input: null as unknown as CreatorInput,
} as const;

// Table creator_social
export interface CreatorSocial {
  id: number | null;
  social_name: string | null;
  link: string | null;
}
export interface CreatorSocialInput {
  id?: number | null;
  social_name?: string | null;
  link?: string | null;
}
const creator_social = {
  tableName: "creator_social",
  columns: ["id", "social_name", "link"],
  requiredForInsert: [],
  primaryKey: null,
  foreignKeys: {},
  $type: null as unknown as CreatorSocial,
  $input: null as unknown as CreatorSocialInput,
} as const;

// Table knex_migrations
export interface KnexMigrations {
  id: number;
  name: string | null;
  batch: number | null;
  migration_time: Date | null;
}
export interface KnexMigrationsInput {
  id?: number;
  name?: string | null;
  batch?: number | null;
  migration_time?: Date | null;
}
const knex_migrations = {
  tableName: "knex_migrations",
  columns: ["id", "name", "batch", "migration_time"],
  requiredForInsert: [],
  primaryKey: "id",
  foreignKeys: {},
  $type: null as unknown as KnexMigrations,
  $input: null as unknown as KnexMigrationsInput,
} as const;

// Table knex_migrations_lock
export interface KnexMigrationsLock {
  index: number;
  is_locked: number | null;
}
export interface KnexMigrationsLockInput {
  index?: number;
  is_locked?: number | null;
}
const knex_migrations_lock = {
  tableName: "knex_migrations_lock",
  columns: ["index", "is_locked"],
  requiredForInsert: [],
  primaryKey: "index",
  foreignKeys: {},
  $type: null as unknown as KnexMigrationsLock,
  $input: null as unknown as KnexMigrationsLockInput,
} as const;

// Table note_skins
export interface NoteSkins {
  id: number;
  name: string;
  css: string;
}
export interface NoteSkinsInput {
  id?: number;
  name: string;
  css: string;
}
const note_skins = {
  tableName: "note_skins",
  columns: ["id", "name", "css"],
  requiredForInsert: ["name", "css"],
  primaryKey: "id",
  foreignKeys: {},
  $type: null as unknown as NoteSkins,
  $input: null as unknown as NoteSkinsInput,
} as const;

// Table scores
export interface Scores {
  id: number;
  percent: number;
  timing: Json;
  user_id: number;
  chart_id: number;
  created_at: Date;
}
export interface ScoresInput {
  id?: number;
  percent: number;
  timing: Json;
  user_id: number;
  chart_id: number;
  created_at?: Date;
}
const scores = {
  tableName: "scores",
  columns: ["id", "percent", "timing", "user_id", "chart_id", "created_at"],
  requiredForInsert: ["percent", "timing", "user_id", "chart_id"],
  primaryKey: "id",
  foreignKeys: {
    user_id: { table: "users", column: "id", $type: null as unknown as Users },
    chart_id: {
      table: "charts",
      column: "id",
      $type: null as unknown as Charts,
    },
  },
  $type: null as unknown as Scores,
  $input: null as unknown as ScoresInput,
} as const;

// Table sessions
export interface Sessions {
  id: string;
  created: Date;
  user_id: number | null;
}
export interface SessionsInput {
  id: string;
  created?: Date;
  user_id?: number | null;
}
const sessions = {
  tableName: "sessions",
  columns: ["id", "created", "user_id"],
  requiredForInsert: ["id"],
  primaryKey: null,
  foreignKeys: {
    user_id: { table: "users", column: "id", $type: null as unknown as Users },
  },
  $type: null as unknown as Sessions,
  $input: null as unknown as SessionsInput,
} as const;

// Table songs
export interface Songs {
  id: number;
  title: string;
  duration: string;
  artist: string;
  offset: number;
  bpm: number;
  file: string;
  creator: number;
  banner_creator_id: number;
}
export interface SongsInput {
  id: number;
  title: string;
  duration: string;
  artist: string;
  offset: number;
  bpm: number;
  file: string;
  creator: number;
  banner_creator_id: number;
}
const songs = {
  tableName: "songs",
  columns: [
    "id",
    "title",
    "duration",
    "artist",
    "offset",
    "bpm",
    "file",
    "creator",
    "banner_creator_id",
  ],
  requiredForInsert: [
    "id",
    "title",
    "duration",
    "artist",
    "offset",
    "bpm",
    "file",
    "creator",
    "banner_creator_id",
  ],
  primaryKey: null,
  foreignKeys: {},
  $type: null as unknown as Songs,
  $input: null as unknown as SongsInput,
} as const;

// Table users
export interface Users {
  id: number;
  email: string;
  password: string;
  username: string;
}
export interface UsersInput {
  id?: number;
  email: string;
  password: string;
  username: string;
}
const users = {
  tableName: "users",
  columns: ["id", "email", "password", "username"],
  requiredForInsert: ["email", "password", "username"],
  primaryKey: "id",
  foreignKeys: {},
  $type: null as unknown as Users,
  $input: null as unknown as UsersInput,
} as const;

export interface TableTypes {
  charts: {
    select: Charts;
    input: ChartsInput;
  };
  covers: {
    select: Covers;
    input: CoversInput;
  };
  creator: {
    select: Creator;
    input: CreatorInput;
  };
  creator_social: {
    select: CreatorSocial;
    input: CreatorSocialInput;
  };
  knex_migrations: {
    select: KnexMigrations;
    input: KnexMigrationsInput;
  };
  knex_migrations_lock: {
    select: KnexMigrationsLock;
    input: KnexMigrationsLockInput;
  };
  note_skins: {
    select: NoteSkins;
    input: NoteSkinsInput;
  };
  scores: {
    select: Scores;
    input: ScoresInput;
  };
  sessions: {
    select: Sessions;
    input: SessionsInput;
  };
  songs: {
    select: Songs;
    input: SongsInput;
  };
  users: {
    select: Users;
    input: UsersInput;
  };
}

export const tables = {
  charts,
  covers,
  creator,
  creator_social,
  knex_migrations,
  knex_migrations_lock,
  note_skins,
  scores,
  sessions,
  songs,
  users,
};
