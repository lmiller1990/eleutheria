import fs from "fs-extra";
import * as shiki from "shiki";
import * as marked from "marked";
import path from "path";
import globby from "globby";

function insertInlineIframes(html: string) {
  const startIframe = "<!-- iframe";
  const endIframe = "iframe -->";

  const newLines: string[] = [];
  const lines = html.split("\n");
  let iframeCode: string[] = [];

  let foundStartFrame = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim() === startIframe) {
      foundStartFrame = true;
    }

    if (!foundStartFrame) {
      newLines.push(line);
    } else {
      if (line.trim() === startIframe) {
        // nothing
      } else if (line.trim() === endIframe) {
        foundStartFrame = false;
        // create srcdoc
        newLines.push(`<iframe srcdoc='${iframeCode.join("\n")}'></iframe>`);
        iframeCode = [];
      } else {
        iframeCode.push(line);
      }
    }
  }

  return newLines.join("\n");
}

type HighlightFn = (code: string, { lang }: { lang: string }) => string;

async function toHtml(dir: string, highlighter: HighlightFn) {
  const md = await fs.readFile(path.join(dir, "README.md"), "utf8");
  const html = marked.marked(md, {
    highlight(code, lang) {
      return highlighter(code, { lang });
    },
  });
  return insertInlineIframes(html);
}

const metadataStartMarker = "<!-- metadata_start";
const metadataEndMarker = "metadata_end -->";
const contentMarker = "<!-- post_content -->";
const postArrayMarker = "/* post_array */";

const dist = path.join(__dirname, "..", "dist");
const src = path.join(__dirname, "..", "src");

function extractPostMetadata(filename: string, html: string) {
  const lines = html.split("\n");

  while (lines.shift()?.trim() !== metadataStartMarker) {
    // ... trim until metadata ...
  }

  const metadata: Record<string, string> = {};

  for (const line of lines) {
    if (line === metadataEndMarker) {
      return metadata;
    }
    const [key, value] = line.split(":");
    metadata[key.trim().toLowerCase()] = value.trim();
    if (key === "Title") {
      const id = value.trim().toLowerCase().replaceAll(" ", "-");
      metadata["filename"] = id;
      metadata["id"] = id;
      metadata["slug"] = id;
    }
  }

  throw Error("Never found metadata end marker");
}

async function main() {
  await fs.rm(dist, { force: true, recursive: true });

  // copy assets (css, font)
  await fs.copy(
    path.join(src, "KleeOne-Regular.ttf"),
    path.join(dist, "KleeOne-Regular.ttf")
  );

  await fs.copy(path.join(src, "output.css"), path.join(dist, "output.css"));

  const highlighter = await shiki.getHighlighter({
    theme: "material-lighter",
  });

  const highlight: HighlightFn = (code, opts) =>
    highlighter.codeToHtml(code, opts);

  const postsDir = path.join(__dirname, "..", "posts");
  const template = await fs.readFile(
    path.join(__dirname, "postTemplate.html"),
    "utf8"
  );
  // const css = await fs.readFile(path.join(__dirname, "..", "src", "output.css"), 'utf8')

  const posts = (await fs.readdir(postsDir))
    .filter((x) => !x.includes(".DS_Store"))
    .map((x) => path.join(postsDir, x));

  const allPostsMetadata: Array<Record<string, string>> = [];

  for (const post of posts) {
    let html = await toHtml(post, highlight);
    html = template.replace(contentMarker, html);
    const metadata = extractPostMetadata(post, html);
    allPostsMetadata.push(metadata);
    await fs.writeFile(path.join(dist, `${metadata.filename}.html`), html);

    // copy all assets, too
    (await fs.readdir(post))
      .filter((x) => x.endsWith("png") || x.endsWith("wav"))
      .forEach(async (file) => {
        const filename = file.split(",").at(-1)!;
        const from = path.join(post, file);
        const dest = path.join(dist, filename);
        console.log(`Copying ${from} to ${dest}`);
        await fs.copy(from, dest);
      });
  }

  (await globby("*.png", { cwd: src })).forEach(async (asset) => {
    await fs.copy(path.join("src", asset), path.join(dist, asset));
  });

  const postsJson = JSON.stringify(allPostsMetadata, null, 4);
  await fs.writeFile(path.join("dist", "metadata.json"), postsJson, "utf8");

  // copy landing page and inject posts
  let landingPageHtml = await fs.readFile(
    path.join("src", "index.html"),
    "utf8"
  );
  landingPageHtml = landingPageHtml.replace(
    postArrayMarker,
    `const posts = ${postsJson};`
  );
  await fs.writeFile(path.join(dist, "index.html"), landingPageHtml);

  // favicon
  await fs.copy(path.join(src, "favicon.ico"), path.join(dist, "favicon.ico"));

  // generate list of static assets
  const assets = await globby("**/*.{png,wav}", {
    absolute: false,
    cwd: dist,
  });

  await fs.writeFile(
    path.join(dist, "assets.json"),
    JSON.stringify(assets, null, 4)
  );
}

main();
