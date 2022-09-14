import mm from "music-metadata";
import path from "path";
import fs from "fs-extra";
import { toHumanTime } from "../utils";

const songsDir = path.join(__dirname, "..", "..", "frontend", "public");

type AwaitedOrNull<T> = T extends Promise<infer U> ? U : null;

type AudioMetadata = AwaitedOrNull<ReturnType<typeof mm.parseFile>>;

export async function generate() {
  const mp3s = (await fs.readdir(songsDir))
    .filter((x) => x.endsWith("mp3"))
    .map((x) => x.split(".mp3")[0]);

  const songsWithLength = await Promise.all(
    mp3s.map<Promise<[string, AudioMetadata]>>(async (id) => [
      id,
      await mm.parseFile(
        path.join(songsDir, `${id}.mp3`)
      ),
    ])
  );

  const json = songsWithLength.reduce<Record<string, string>>((acc, curr) => {
    const [id, metadata] = curr;

    const d = metadata.format.duration;

    return {
      ...acc,
      [id]: d ? toHumanTime(d) : "??",
    };
  }, {});

  return fs.writeFile("songMetadata.json", JSON.stringify(json, null, 4));
}
