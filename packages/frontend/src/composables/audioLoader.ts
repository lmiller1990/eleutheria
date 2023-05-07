import { AudioData } from "@packages/shared";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";
import { computed, reactive } from "vue";

const wait = async () => new Promise((res) => setTimeout(res, 5));

const throttle = true;

function createDeferred() {
  return new Promise((resolve) => {
    window.setTimeout(resolve, 1000);
  });
}

async function getAudioData(
  url: string,
  loadingEmitter: LoadingEmitter
): Promise<AudioData> {
  const dfd = createDeferred();

  const res = await window.fetch(url);
  const cache = await caches.open("eleutheria");

  const cachedResponse = await cache.match(url);

  if (cachedResponse) {
    const buf = await cachedResponse.arrayBuffer();
    const audioContext = new AudioContext();
    const audioBuffer = await audioContext.decodeAudioData(buf);
    loadingEmitter.emit("song:loading:chunk", 100, 100);
    await dfd;

    return { audioBuffer, audioContext };
  }

  const reader = res.body!.getReader();
  const totalSizeInBytes = parseInt(res.headers.get("content-length")!, 10);

  const stream = new ReadableStream({
    start(controller) {
      async function pump(): Promise<(() => undefined) | undefined> {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
          return;
        }

        if (throttle) {
          await wait();
        }

        loadingEmitter.emit(
          "song:loading:chunk",
          value.length,
          totalSizeInBytes
        );
        controller.enqueue(value);
        return pump();
      }
      return pump();
    },
  });

  const response = new Response(stream);
  await cache.put(url, response.clone());
  const buf = await response.arrayBuffer();

  const audioContext = new AudioContext();
  const audioBuffer = await audioContext.decodeAudioData(buf);

  return { audioBuffer, audioContext };
}

type LoadingEmitterEvents = {
  "song:loading:chunk": (
    chunkSizeInBytes: number,
    totalSizeInBytes: number
  ) => void;
  "song:loading:complete": (audioData: AudioData) => void;
};

type LoadingEmitter = TypedEmitter<LoadingEmitterEvents>;

export function useAudioLoader(url: string) {
  const bytes = reactive({
    streamed: 0,
    total: 1,
  });

  const percent = computed(() => {
    return (bytes.streamed / bytes.total) * 100;
  });

  const loadingEmitter =
    new (class extends (EventEmitter as new () => LoadingEmitter) {})();

  loadingEmitter.on("song:loading:chunk", (s, t) => {
    bytes.streamed += s;
    bytes.total = t;
  });

  getAudioData(url, loadingEmitter).then((payload) => {
    loadingEmitter.emit("song:loading:complete", payload);
  });

  return {
    emitter: loadingEmitter,
    bytes,
    percent,
  };
}
