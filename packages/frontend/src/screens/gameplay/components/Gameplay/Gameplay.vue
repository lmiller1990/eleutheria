<script lang="ts" setup>
import {
  computed,
  FunctionalComponent,
  h,
  onBeforeUnmount,
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
import { AudioData, extractNotesFromWorld, Summary } from "@packages/shared";
import { useEditor } from "../../editor";
import { GameplayScoreProps, GameplayScore } from "./GameplayScore";
import { useGameplayOptions } from "../../../../composables/gameplayOptions";
import { getParams } from "../../fetchData";
import { useAudioLoader } from "../../../../composables/audioLoader";
import { createGameplayQuery } from "../../gameplayQuery";

const editing = false;

const props = defineProps<{
  __testingDoNotStartSong?: boolean;
  __testingManualMode?: boolean;
  gql: GameplayQuery;
  getAudioData: () => AudioData;
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
  throw Error(
    "Expected props.gql to contain song.chart.parsedTapNoteChart but it did not."
  );
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

const scoreData = computed<Omit<GameplayScoreProps, "animate">>(() => {
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
const query = createGameplayQuery(parseInt(songId, 10), parseInt(chartId, 10));

let init: ReturnType<typeof create>

onMounted(async () => {
  if (!root.value) {
    return;
  }

  init = create(
    root.value,
    {
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
      songCompleted,
    },
    props.__testingDoNotStartSong,
    props.__testingManualMode,
    editing ? 147000 : undefined // repeat
  );

  if (!init || !init.game) {
    // Only occurs during testing. We want a way to render this screen w/o starting gameplay.
    return;
  }

  game = init.game;

  if (editing) {
    if (!init?.game) {
      throw Error('init.game not defined. How did this happen!')
    }

    init.game.editorRepeat = {
      emitAfterMs: 7000,
      emitAfterMsCallback: async () => {
        await query.executeQuery();
        const { emitter } = useAudioLoader(
          `${import.meta.env.VITE_CDN_URL}/${file}.wav`
        );
        emitter.on("song:loading:complete", (payload) => {
          // TODO: may only need to do this once
          init?.game?.updateChart({
            tapNotes: props.gql.song.chart.parsedTapNoteChart,
          });
          init?.stop();
          init?.start(payload);
        });
      },
    };
  }

  init.start(props.getAudioData());
});

onBeforeUnmount(() => {
  init?.game?.stop()
})

const { emitter } = useEditor(editing);

emitter.subscribe("editor:chart:updated", () => {
  // TODO: may only need to do this once
  query.executeQuery();
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
            <SongImage :file="file" :level="props.gql.song.chart.level" />
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
