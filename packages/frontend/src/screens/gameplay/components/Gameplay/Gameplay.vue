<script lang="ts" setup>
import {
  computed,
  FunctionalComponent,
  h,
  onMounted,
  reactive,
  ref,
} from "vue";
import { windowsWithMiss } from "../../gameConfig";
import type { Game, World } from "@packages/engine";
import { SongImage } from "../../../SongSelectScreen/SongImage";
import { SongTitle } from "../../components/Gameplay/SongTitle";
import { useRouter } from "vue-router";
import { useEventListener } from "../../../../utils/useEventListener";
import { gql, useMutation } from "@urql/vue";
import {
  GameplayQuery,
  Gameplay_SummaryDocument,
} from "../../../../generated/graphql";
import { create } from "../../gameplay";
import { extractNotesFromWorld, Summary } from "@packages/shared";
import { useEditor } from "../../editor";
import { GameplayScoreProps, GameplayScore } from "./GameplayScore";
import { useGameplayOptions } from "../../../../composables/gameplayOptions";
import { getParams } from "../../fetchData";

const editing = false;

const props = defineProps<{
  __testingDoNotStartSong?: boolean;
  __testingManualMode?: boolean;
  getAudioBuffer: () => AudioBuffer;
  gql: GameplayQuery;
}>();

const emit = defineEmits<{
  (event: "songLoadingChunk", streamedBytes: number, totalBytes: number): void;
  (event: "songLoadingComplete"): void;
}>();

const root = ref<HTMLDivElement>();

gql`
  mutation Gameplay_Summary(
    $tapNotes: [SummaryNote!]!
    $holdNotes: [[SummaryNote!]!]!
    $chartId: Int!
  ) {
    saveScore(
      data: { tapNotes: $tapNotes, holdNotes: $holdNotes, chartId: $chartId }
    ) {
      id
    }
  }
`;

if (!props.gql.song.chart.parsedTapNoteChart) {
  throw Error("error!!!!");
}

const saveScore = useMutation(Gameplay_SummaryDocument);

const timingSummary = reactive<
  Record<typeof windowsWithMiss[number], number> & { percent: number }
>({
  absolute: 0,
  perfect: 0,
  miss: 0,
  percent: 0,
});

async function songCompleted(world: World) {
  const summaryData = extractNotesFromWorld(world);

  const res = await saveScore.executeMutation({
    ...summaryData,
    chartId: props.gql.song.chart.id,
  });

  if (!res.data?.saveScore?.id) {
    throw Error(`Expected id to be returned for score`);
  }

  router.push({ path: "/summary", query: { id: res.data.saveScore.id } });
}

const scoreData = computed<GameplayScoreProps>(() => {
  return {
    percent: timingSummary.percent,
    timing: [
      {
        window: "Absolute",
        count: timingSummary.absolute,
      },
      {
        window: "Perfect",
        count: timingSummary.perfect,
      },
      {
        window: "Miss",
        count: timingSummary.miss,
      },
    ],
  };
});

function updateSummary(summary: Summary) {
  for (const win of windowsWithMiss) {
    timingSummary[win] = summary.timing[win].count;
  }
  timingSummary.percent = summary.percent;
}

let game: Game | undefined;
const { modifierManager } = useGameplayOptions();

const router = useRouter();

const heldKeys = new Set<string>();

function stop(event: KeyboardEvent) {
  heldKeys.delete(event.code);

  if (event.code === "KeyQ") {
    game?.stop();
    router.push("/");
  }
}

function handleKeydown(event: KeyboardEvent) {
  heldKeys.add(event.code);

  if (heldKeys.has("Space") && event.code === "KeyE") {
  }

  // lower the cover
  if (heldKeys.has("Space") && event.code === "KeyJ") {
    modifierManager.setCover({
      offset: modifierManager.cover.offset + 50,
    });
  }

  // raise the cover
  if (heldKeys.has("Space") && event.code === "KeyK") {
    modifierManager.setCover({
      offset: modifierManager.cover.offset - 50,
    });
  }
}

useEventListener("keyup", stop);
useEventListener("keydown", handleKeydown);

const { file, songId, chartId } = getParams();

onMounted(async () => {
  if (!root.value) {
    return;
  }

  const fileUrl = `${import.meta.env.VITE_CDN_URL}/${file}.wav`;

  const init = create(
    root.value,
    {
      audioBuffer: props.getAudioBuffer(),
      modifierManager,
      updateSummary,
      songData: {
        chart: {
          parsedTapNoteChart: {
            tapNotes: props.gql.song.chart.parsedTapNoteChart,
          },
          offset: props.gql.song.chart.offset,
        },
      },
      paramData: {
        songId,
        file: fileUrl,
        chartId,
      },
      songCompleted,
    },
    props.__testingDoNotStartSong,
    props.__testingManualMode,
    editing ? 63000 : undefined // repeat
  );

  if (!init || !init.game) {
    // Only occurs during testing. We want a way to render this screen w/o starting gameplay.
    return;
  }

  game = init.game;

  game.loadingEmitter.on("song:loading:chunk", (s, t) => {
    emit("songLoadingChunk", s, t);
  });

  game.loadingEmitter.on("song:loading:complete", () => {
    emit("songLoadingComplete");
  });

  if (editing) {
    init.game.editorRepeat = {
      emitAfterMs: 7000,
      emitAfterMsCallback: async () => {
        // TODO: may only need to do this once
        // await query.executeQuery({ requestPolicy: "network-only" });
        init.game?.updateChart({
          tapNotes: props.gql.song.chart.parsedTapNoteChart.slice(),
          // offset: gqlData.value.song.chart.offset,
        });
        init.stop();
        init.start();
      },
    };
  }

  init.start();
});

const { emitter } = useEditor(editing);

emitter.subscribe("editor:chart:updated", () => {
  // TODO: may only need to do this once
  // query.executeQuery({ requestPolicy: "network-only" });
});

const Side: FunctionalComponent = (_props, { slots }) => {
  return h("div", { class: "mt-48" }, slots);
};
</script>

<template>
  <div class="flex justify-center">
    <div class="max-w-screen-lg">
      <div class="gameplay-content">
        <Side class="mt-48 mr-8">
          <div>
            <SongImage
              :src="`/static/${file}.png`"
              :level="props.gql.song.chart.level"
            />
            <SongTitle :title="props.gql.song.title" />
          </div>
        </Side>

        <div class="gameplay" v-once>
          <div ref="root" class="max-w-screen-log" v-once />
        </div>

        <Side class="flex ml-8">
          <GameplayScore
            :percent="scoreData.percent"
            :timing="scoreData.timing"
          />
        </Side>
      </div>
    </div>
  </div>
</template>

<style>
.gameplay-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr 1fr;
  column-gap: 40px;
}

.empty {
  visibility: hidden;
}

.capitalize {
  text-transform: capitalize;
}
</style>
