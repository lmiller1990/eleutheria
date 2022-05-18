import { padStart } from "@packages/audio-utils";
import type { BaseNote, ChartMetadata, HoldNote } from "@packages/chart-parser";
import {
  createChart,
  EngineConfiguration,
  initGameState,
  InputManager,
  InputManagerConfig,
  PreviousFrameMeta,
  updateGameState,
  World,
} from ".";
import type { EngineNote, JudgementResult } from "./engine";

export async function fetchAudio(
  id: string,
  songUrl: string,
  paddingMs: number
) {
  const audioContext = new AudioContext();

  const res = await window.fetch(`${songUrl}/${id}.mp3`);
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
  song: {
    metadata: ChartMetadata;
    tapNotes: BaseNote[];
    holdNotes: HoldNote[];
  };
  preSongPadding?: number;
  postSongPadding?: number;
  songUrl: string;
  engineConfiguration: EngineConfiguration;
  codeColumns: Map<string, number>;
  inputManagerConfig: Partial<InputManagerConfig>;
  manualMode?: boolean;
}

export interface GameLifecycle {
  onUpdate?: (world: World, previousFrameMeta: PreviousFrameMeta) => void;
  onDebug?: (world: World, fps: number) => void;
  onStart?: (world: World) => void;
  onJudgement?: (world: World, judgementResults: JudgementResult[]) => void;
  onSongCompleted?: (
    world: World,
    previousFrameMeta: PreviousFrameMeta
  ) => void;
}

export class Game {
  #fps = 0;
  #dt = 0;
  #lastDebugUpdate = 0;
  #timeOfLastNote: number;
  #source?: AudioBufferSourceNode;
  #inputManager?: InputManager;
  #config: GameConfig;
  #lifecycle: GameLifecycle;

  constructor(config: GameConfig, lifecycle: GameLifecycle) {
    this.#config = config;
    this.#lifecycle = lifecycle;
    this.#timeOfLastNote =
      config.song.tapNotes.reduce(
        (acc, curr) => (curr.ms > acc ? curr.ms : acc),
        0
      ) +
      (this.#config.preSongPadding || 0) +
      this.#config.song.metadata.offset +
      (this.#config.postSongPadding || 0);
  }

  async start(id: string, songData: ChartMetadata) {
    const chart = createChart({
      tapNotes: this.#config.song.tapNotes.map((x) => ({
        ...x,
        missed: false,
        canHit: true,
      })),
      holdNotes: this.#config.song.holdNotes.map<EngineNote[]>((notes) => {
        return notes.map((note) => ({
          ...note,
          missed: false,
          canHit: true,
        }));
      }),
      offset:
        (this.#config.preSongPadding || 0) + this.#config.song.metadata.offset,
    });

    const gs = initGameState(chart);

    const inputManager = new InputManager(this.#config.codeColumns, {
      ...this.#config.inputManagerConfig,
      manualMode: this.#config.manualMode,
    });

    inputManager.listen();

    const play = await fetchAudio(
      id,
      this.#config.songUrl,
      this.#config.preSongPadding || 0
    );

    const { audioContext, source, startTime } = play();

    const gameState: World = {
      audioContext,
      songCompleted: false,
      source,
      combo: 0,
      t0: startTime,
      songData,
      inputManager,
      chart: {
        tapNotes: gs.tapNotes,
        holdNotes: gs.holdNotes,
      },
      startTime,
      inputs: [],
      time: 0,
    };

    gameState.inputManager.setOrigin(gameState.t0);

    this.#lifecycle.onStart?.(gameState);
    this.gameLoop(gameState);

    this.#inputManager = inputManager;
    this.#source = source;
  }

  stop() {
    this.#inputManager?.teardown();
    this.#source?.stop();
  }

  setTestOnlyDeltaTime(dt: number) {
    this.#dt = dt;
    this.#inputManager?.setTestOnlyDeltaTime(dt);
  }

  gameLoop(gameState: World) {
    this.#fps += 1;

    this.#dt = this.#config.manualMode
      ? this.#dt
      : gameState.audioContext.getOutputTimestamp().performanceTime! -
        gameState.t0;

    if (this.#dt > 3000) {
      // return;
    }

    const world: World = {
      ...gameState,
      startTime: gameState.t0,
      time: this.#dt,
      inputs: gameState.inputManager.activeInputs,
    };

    const { world: updatedWorld, previousFrameMeta } = updateGameState(
      world,
      this.#config.engineConfiguration
    );

    this.#lifecycle.onUpdate?.(updatedWorld, previousFrameMeta);

    if (
      this.#lifecycle.onJudgement &&
      previousFrameMeta.judgementResults.length
    ) {
      this.#lifecycle.onJudgement(
        updatedWorld,
        previousFrameMeta.judgementResults
      );
    }

    if (this.#dt - this.#lastDebugUpdate > 1000) {
      this.#lifecycle.onDebug?.(updatedWorld, this.#fps);
      this.#fps = 0;
      this.#lastDebugUpdate = this.#dt;
    }

    gameState.inputManager.clear();

    if (this.#dt > this.#timeOfLastNote) {
      this.stop();
      this.#lifecycle.onSongCompleted?.(updatedWorld, previousFrameMeta);
      return;
    }

    window.requestAnimationFrame(() => this.gameLoop(updatedWorld));
  }
}
