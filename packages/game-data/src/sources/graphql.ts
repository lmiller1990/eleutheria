import { Context } from "../graphql/context";
import {
  cacheExchange,
  createClient,
  dedupExchange,
  fetchExchange,
  ssrExchange,
} from "@urql/core";
import fetch from 'node-fetch'

export class GraphQLDataSource {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  createUrqlClient() {
    const ssr = ssrExchange({
      isClient: false,
    });

    const client = createClient({
      url: "http://localhost:5566/graphql",
      exchanges: [dedupExchange, cacheExchange, ssr, fetchExchange],
      // @ts-ignore - types assume window.fetch
      fetch,
    });

    return { ssr, client };
  }
}
