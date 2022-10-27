import type { BaseNote, HoldNote } from "@packages/chart-parser";
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
import { ModifierManager } from "@packages/frontend/src/screens/gameplay/modiferManager";
import type { EngineNote, JudgementResult } from "./engine";

export type AudioProvider = (
  id: string,
  paddingMs: number,
  startAtMs?: number
) => Promise<() => AudioProviderResult>;

interface AudioProviderResult {
  audioContext: AudioContext;
  source: AudioBufferSourceNode;
  startTime: number;
}

async function getAudioData(
  url: string,
  audioContext: AudioContext
): Promise<AudioBuffer> {
  const res = await window.fetch(url);
  const buf = await res.arrayBuffer();
  const decoded = await audioContext.decodeAudioData(buf);
  // audioCache.set(url, decoded);
  return decoded;
}

export const fetchAudio: AudioProvider = async (
  file: string,
  paddingMs: number,
  startAtMs: number = 0
) => {
  const audioContext = new AudioContext();

  const { padStart } = await import("@packages/audio-utils");
  let buffer = await getAudioData(`/static/${file}`, audioContext);
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
    source.start(0, startAtMs / 1000);
    const startTime = audioContext.getOutputTimestamp().performanceTime!;

    return { audioContext, source, startTime };
  };
};

export interface DevModeOptions {
  manualMode?: boolean;
  startAtMs?: number;
}

export interface GameConfig {
  chart: {
    tapNotes: BaseNote[];
    holdNotes: HoldNote[];
    offset: number;
  };
  /** used for showing an inline game in the game options pane. Not very performance due to use of getBoundingClientRect(). */
  noteCulling?: boolean;
  preSongPadding?: number;
  postSongPadding?: number;
  engineConfiguration: EngineConfiguration;
  codeColumns: Map<string, number>;
  inputManagerConfig: Partial<InputManagerConfig>;
  dev?: DevModeOptions;
}

export interface GameLifecycle {
  onUpdate?: (
    world: World,
    previousFrameMeta: PreviousFrameMeta,
    modifierManager: ModifierManager,
    updated: number
  ) => void;
  onDebug?: (world: World, fps: number) => void;
  onStart?: (world: World) => void;
  onJudgement?: (world: World, judgementResults: JudgementResult[]) => void;
  onSongCompleted?: (
    world: World,
    previousFrameMeta: PreviousFrameMeta
  ) => void;
}

export interface GameAPI {
  start(id: string): Promise<void>;
  stop: () => void;
}

export class Game implements GameAPI {
  #fps = 0;
  #dt = 0;
  #lastDebugUpdate = 0;
  #timeOfLastNote: number;
  #source?: AudioBufferSourceNode;
  #audioContext?: AudioContext;
  #inputManager?: InputManager;
  #config: GameConfig;
  #lifecycle: GameLifecycle;
  #modifierManager: ModifierManager;
  #audioProvider: AudioProvider;
  #nextAnimationFrame?: number;
  /**
   * Used for repeating a (period) of song many times over.
   * This is exclusively used for Edit Mode.
   */
  editorRepeat?: {
    emitAfterMs: number;
    emitAfterMsCallback: () => void;
  };
  /**
   * Used exclusively for assist tick in edit mode
   */
  #gameStartTime = performance.now();

  #__dev: {
    initialGameState?: World;
  } = {};

  constructor(
    config: GameConfig,
    lifecycle: GameLifecycle,
    audioProvider: AudioProvider = fetchAudio,
    modifierManager: ModifierManager = new ModifierManager()
  ) {
    this.#config = config;
    this.#lifecycle = lifecycle;
    this.#modifierManager = modifierManager;
    this.#audioProvider = audioProvider;
    this.#timeOfLastNote =
      config.chart.tapNotes.reduce(
        (acc, curr) => (curr.ms > acc ? curr.ms : acc),
        0
      ) +
      (this.#config.preSongPadding || 0) +
      this.#config.chart.offset +
      (this.#config.postSongPadding || 0);
  }

  get modifierManager() {
    return this.#modifierManager;
  }

  async start(id: string) {
    this.#gameStartTime = performance.now();
    const chart = createChart({
      tapNotes: this.#config.chart.tapNotes.map((x) => ({
        ...x,
        missed: false,
        canHit: true,
      })),
      holdNotes: this.#config.chart.holdNotes.map<EngineNote[]>((notes) => {
        return notes.map((note) => ({
          ...note,
          missed: false,
          canHit: true,
        }));
      }),
      offset: (this.#config.preSongPadding || 0) + this.#config.chart.offset,
    });

    const gs = initGameState(chart);

    const inputManager = new InputManager(this.#config.codeColumns, {
      ...this.#config.inputManagerConfig,
      dev: this.#config.dev,
    });

    inputManager.listen();

    const play = await this.#audioProvider(
      id,
      this.#config.preSongPadding || 0,
      this.#config.dev?.startAtMs
    );

    const { audioContext, source, startTime } = play();

    const gameState: World = {
      audioContext,
      songCompleted: false,
      source,
      combo: 0,
      t0: startTime,
      inputManager,
      chart: {
        tapNotes: gs.tapNotes,
        holdNotes: gs.holdNotes,
      },
      startTime,
      inputs: [],
      time: 0,
    };

    this.#__dev.initialGameState = gameState;

    gameState.inputManager.setOrigin(gameState.t0);

    this.#lifecycle.onStart?.(gameState);
    this.gameLoop(gameState);

    this.#inputManager = inputManager;
    this.#source = source;
    this.#audioContext = audioContext;
  }

  updateChart(chart: Partial<GameConfig["chart"]>) {
    this.#config.chart = {
      ...this.#config.chart,
      ...chart,
    };
  }

  stop() {
    if (this.#nextAnimationFrame) {
      window.cancelAnimationFrame(this.#nextAnimationFrame);
    }

    this.#inputManager?.teardown();
    this.#source?.stop();
    this.#audioContext?.close();
    this.#__dev.initialGameState = undefined;
  }

  setTestOnlyDeltaTime(dt: number) {
    if (!this.#__dev.initialGameState) {
      throw Error(
        "Make sure you call start before attempting to increment the game loop"
      );
    }
    this.#dt = dt;
    this.#inputManager?.setTestOnlyDeltaTime(dt);
    this.gameLoop({ ...this.#__dev.initialGameState, time: dt });
  }

  gameLoop(gameState: World) {
    this.#fps += 1;

    if (this.editorRepeat) {
      const playbackDt =
        gameState.audioContext.getOutputTimestamp().performanceTime! -
        gameState.t0;
      if (this.editorRepeat.emitAfterMs < playbackDt) {
        this.editorRepeat.emitAfterMsCallback();
        return;
      }
    }

    this.#dt = this.#config.dev?.manualMode
      ? this.#dt
      : gameState.audioContext.getOutputTimestamp().performanceTime! -
        gameState.t0 +
        (this.#config.dev?.startAtMs ?? 0);

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

    this.#lifecycle.onUpdate?.(
      updatedWorld,
      previousFrameMeta,
      this.#modifierManager,
      this.#gameStartTime
    );

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

    if (this.#config.dev?.manualMode) {
      return;
    }

    this.#nextAnimationFrame = window.requestAnimationFrame(() =>
      this.gameLoop(updatedWorld)
    );
  }
}
