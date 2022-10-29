import { Context } from "../graphql/context";
import { Client, gql, ssrExchange } from "@urql/core";

// Copy pasted from SongSelectScreen
// TODO: share code.
const SongSelectScreen_Songs = gql`
  query SongSelectScreen_Songs {
    songs {
      id
      title
      file
      duration
      artist
      bpm
    }
  }
`;

const SongSelectScreen_Chart = gql`
  query SongSelectScreen_Chart($songId: Int!) {
    viewer {
      id
      email
    }
    charts(songId: $songId) {
      id
      difficulty
      level
      tapNoteCount
      personalBest
    }
  }
`;

type SSRExchange = ReturnType<typeof ssrExchange>;

export class GraphQLActions {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  #queryUrql(
    client: Client,
    query: typeof SongSelectScreen_Songs | typeof SongSelectScreen_Chart,
    variables?: Record<string, any>
  ) {
    return client
      .query(query, variables ?? {}, {
        fetchOptions: {
          headers: {
            "x-graphql-from": "server",
            "Content-Type": "application/json",
            Cookie: Object.entries(this.#ctx.req.cookies)
              .map(([k, v]) => `${k}=${v}`)
              .join("; "),
          },
        },
      })
      .toPromise();
  }

  async #clientQuery(client: Client, ssr: SSRExchange) {
    // await for this - side effect is to populate the urql client cache
    await Promise.all([
      this.#queryUrql(client, SongSelectScreen_Chart, { songId: 3 }),
      this.#queryUrql(client, SongSelectScreen_Songs),
    ]);
    return ssr.extractData();
  }

  async selectSongScreenQuery(): Promise<string> {
    const { client, ssr } = this.#ctx.sources.graphql.createUrqlClient();
    const ssrData = await this.#clientQuery(client, ssr);
    return JSON.stringify(ssrData);
  }
}
