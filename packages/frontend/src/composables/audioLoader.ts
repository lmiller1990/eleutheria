import { AudioData } from "@packages/shared";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";

async function getAudioData(
  url: string,
  loadingEmitter: LoadingEmitter
): Promise<AudioData> {
  const res = await window.fetch(url);

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
  const loadingEmitter =
    new (class extends (EventEmitter as new () => LoadingEmitter) {})();

  getAudioData(url, loadingEmitter).then((payload) => {
    loadingEmitter.emit("song:loading:complete", payload);
  });

  return {
    emitter: loadingEmitter,
  };
}
