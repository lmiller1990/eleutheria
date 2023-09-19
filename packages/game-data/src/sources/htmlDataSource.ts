import { debug } from "../../util/debug";
import { Context } from "../graphql/context";
import fs from "fs-extra";
import path from "path";
import dedent from "dedent";

const log = debug(`game-data:htmlDataSource`);

export class HtmlDataSource {
  #ctx: Context;

  constructor(ctx: Context) {
    this.#ctx = ctx;
  }

  get #commonHead() {
    return `
      <meta charset="UTF-8" />
      <link rel="icon" type="image/svg+xml" href="favicon.svg" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Eleutheria</title>
    `;
  }

  get #commonBody() {
    return `
      <div id="options-teleport"></div>
      <div id="app" class="h-full flex justify-center"></div>
          `;
  }

  async prodModeIndexHtml(songCount: number, ssrData: string) {
    const fe = path.join(__dirname, "..", "..", "..", "..", "frontend");
    const manifest = await fs.readJson(path.join(fe, "dist", "manifest.json"));

    const moduleFile = manifest["src/main.ts"].file;
    const mainCss = manifest["src/main.css"].file;

    return dedent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          ${this.#commonHead}
          <link rel="stylesheet" href="${mainCss}" />
          <script>window.__SSR_DATA__ = ${ssrData}</script>
          <script>window.__SONG_COUNT__ = ${songCount}</script>
        </head>

        <body>
          ${this.#commonBody}
          <script type="module" src="${moduleFile}"></script>
        </body>
      </html>`;
  }

  /**
   * data is result of initial GraphQL query -> JSON.stringified
   */
  devModeIndexHtml(songCount: number, ssrData: string) {
    return dedent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          ${this.#commonHead}
          <script>window.__SSR_DATA__ = ${ssrData}</script>
          <script>window.__SONG_COUNT__ = ${songCount}</script>
        </head>

        <body>
          ${this.#commonBody}
          <script type="module" src="http://localhost:5173/@vite/client"></script>
          <script type="module" src="http://localhost:5173/src/main.ts"></script>
        </body>
      </html>`;
  }
}
