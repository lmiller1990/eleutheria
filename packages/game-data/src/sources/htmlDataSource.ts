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

  async prodModeIndexHtml () {
    const fe = path.join(__dirname, "..", "..", "..", "frontend");
    const manifest = await fs.readJson(path.join(fe, "dist", "manifest.json"));

    const moduleFile = manifest["src/main.ts"].file;
    const mainCss = manifest["src/main.css"].file;

    return dedent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="favicon.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <link rel="stylesheet" href="${mainCss}" />
          <title>Vite App</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap"
            rel="stylesheet"
          />
          <link href="http://fonts.cdnfonts.com/css/sansation" rel="stylesheet" />
        </head>

        <body>
          <div id="app" class="h-full flex justify-center"></div>
          <script type="module" src="${moduleFile}"></script>
        </body>
      </html>`
  }

  get devModeIndexHtml() {
    return dedent`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <link rel="icon" type="image/svg+xml" href="favicon.svg" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Vite App</title>
          <link
            href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@700&display=swap"
            rel="stylesheet"
          />
          <link href="http://fonts.cdnfonts.com/css/sansation" rel="stylesheet" />
        </head>

        <body>
          <div id="app" class="h-full flex justify-center"></div>
          <script type="module" src="http://localhost:5173/@vite/client"></script>
          <script type="module" src="http://localhost:5173/src/main.ts"></script>
        </body>
      </html>`;
  }
}
