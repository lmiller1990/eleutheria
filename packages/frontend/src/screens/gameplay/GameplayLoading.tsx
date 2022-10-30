import type { FunctionalComponent } from "vue";
import { EventEmitter } from "events";
import TypedEmitter from "typed-emitter";

async function getAudioData(
  url: string,
  audioContext: AudioContext,
  loadingEmitter: LoadingEmitter
): Promise<AudioBuffer> {
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
  const decoded = await audioContext.decodeAudioData(buf);
  return decoded;
}

type LoadingEmitterEvents = {
  "song:loading:chunk": (
    chunkSizeInBytes: number,
    totalSizeInBytes: number
  ) => void;
  "song:loading:complete": (audioBuffer: AudioBuffer) => void;
};

type LoadingEmitter = TypedEmitter<LoadingEmitterEvents>;

export function useAudioLoader(url: string) {
  const ac = new AudioContext();
  const loadingEmitter =
    new (class extends (EventEmitter as new () => LoadingEmitter) {})();

  getAudioData(url, ac, loadingEmitter).then((buffer) => {
    loadingEmitter.emit("song:loading:complete", buffer);
  });

  return {
    emitter: loadingEmitter,
  };
}

export const GameplayLoading: FunctionalComponent<{ percent: number }> = (
  props
) => {
  return <div>{props.percent}%</div>;
};
