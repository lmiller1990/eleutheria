import { padStart } from "@packages/audio-utils";
import type { ParsedChart } from "@packages/chart-parser";
import { createChart, EngineConfiguration, initGameState, InputManager, InputManagerConfig, PreviousFrameMeta, updateGameState, World } from ".";

const SONG = {
  // SONG_ID: "rave",
  // FORMAT: "mp3"
  SONG_ID: "165-bpm-test",
  FORMAT: "ogg",
} as const;

export const url = (song: typeof SONG) =>
  `http://localhost:4000/${song.SONG_ID}.${song.FORMAT}`;

export async function fetchAudio(paddingMs: number) {
  const audioContext = new AudioContext();

  const res = await window.fetch(url(SONG));
  const buf = await res.arrayBuffer();
  let buffer = await audioContext.decodeAudioData(buf);
  buffer = padStart(audioContext, buffer, paddingMs);

  var gainNode = audioContext.createGain();
  gainNode.gain.value = 1.0;
  gainNode.connect(audioContext.destination);

  return () => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    // use this for no assist tick
    // source.connect(audioContext.destination);
    source.connect(gainNode);
    source.start();
    const startTime = audioContext.getOutputTimestamp().performanceTime!;

    return { audioContext, source, startTime };
  };
}

export interface GameConfig {
  chart: ParsedChart
  preSongPadding: number
  engineConfiguration: EngineConfiguration
  codeColumns: Map<string, number>
  inputManagerConfig: Partial<InputManagerConfig>
}

export interface GameLifecycle {
  onUpdate: (world: World, previousFrameMeta: PreviousFrameMeta) => void
}

export class Game {
  #ticks = 0

  constructor(private config: GameConfig, private lifecycle: GameLifecycle) {}

  async start () {
    const chart = createChart({
      notes: this.config.chart.notes.map((x) => ({ ...x, missed: false, canHit: true })),
      offset: this.config.preSongPadding + this.config.chart.metadata.offset,
    });

    const gs = initGameState(chart);

    const inputManager = new InputManager(
      this.config.codeColumns,
      this.config.inputManagerConfig
    );

    inputManager.listen();

    // const stop = () => {
    //   gameState.inputManager.teardown();
    //   gameState.source.stop();
    //   cancel = true;
    // };

    const play = await fetchAudio(this.config.preSongPadding);

    const { audioContext, source, startTime } = play();

    const gameState: World = {
      audioContext,
      source,
      combo: 0,
      t0: startTime,
      inputManager,
      chart: {
        notes: gs.notes,
      },
      startTime,
      inputs: [],
      time: 0,
    };

    // $stop.addEventListener("click", stop);
    gameState.inputManager.setOrigin(gameState.t0);

    this.gameLoop(gameState);
  }

  gameLoop (gameState: World) {
    this.#ticks += 1;

    const dt =
      gameState.audioContext.getOutputTimestamp().performanceTime! - gameState.t0;

    const world: World = {
      ...gameState,
      startTime: gameState.t0,
      time: dt,
      inputs: gameState.inputManager.activeInputs,
    };

    const { world: updatedWorld, previousFrameMeta } = updateGameState(
      world,
      this.config.engineConfiguration
    );

    this.lifecycle.onUpdate(updatedWorld, previousFrameMeta)

    gameState.inputManager.update(dt);

    window.requestAnimationFrame(() =>
      this.gameLoop(updatedWorld)
    );
  }
}
