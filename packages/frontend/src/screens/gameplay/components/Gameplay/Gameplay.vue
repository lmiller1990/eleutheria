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
import { injectStylesheet } from "../../../../plugins/injectGlobalCssVars";
import { useRouter } from "vue-router";
import { useEventListener } from "../../../../utils/useEventListener";
import { gql, useMutation, useQuery } from "@urql/vue";
import {
  GameplayDocument,
  Gameplay_SummaryDocument,
} from "../../../../generated/graphql";
import { create } from "../../gameplay";
import { fetchUser, getParams } from "../../fetchData";
import { extractNotesFromWorld, Summary } from "@packages/shared";
import { useEditor } from "../../editor";
import { GameplayScoreProps, GameplayScore } from "./GameplayScore";
import { useGameplayOptions } from "../../../../composables/gameplayOptions";

export interface GameplayProps {
  __testingDoNotStartSong?: boolean;
  __testingManualMode?: boolean;
}

const editing = false;

const props = defineProps<GameplayProps>();

const root = ref<HTMLDivElement>();

gql`
  query Gameplay($songId: Int!, $chartId: Int!) {
    song(songId: $songId) {
      id
      offset
      title
      file
      artist
      chart(chartId: $chartId) {
        id
        difficulty
        offset
        level
        parsedTapNoteChart {
          id
          ms
          column
          measureNumber
          char
        }
      }
    }
  }
`;

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

const { songId, chartId, file } = getParams();

const [userData, query] = await Promise.all([
  fetchUser(),
  useQuery({
    query: GameplayDocument,
    requestPolicy: "network-only",
    variables: {
      songId: parseInt(songId, 10),
      chartId: parseInt(chartId, 10),
    },
  }),
]);

const gqlData = computed(() => {
  if (!query.data.value?.song?.chart.parsedTapNoteChart) {
    throw Error("uh oh!");
  }
  return query.data.value;
});

injectStylesheet(userData.css, "user-css");

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
    chartId: gqlData.value.song.chart.id,
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

onMounted(async () => {
  if (!root.value) {
    return;
  }

  const fileUrl = import.meta.env.PROD
    ? `${import.meta.env.VITE_CDN_URL}/${file}.wav`
    : `/static/${file}.wav`;

  const init = create(
    root.value,
    {
      modifierManager,
      updateSummary,
      songData: {
        chart: {
          parsedTapNoteChart: {
            tapNotes: gqlData.value.song.chart.parsedTapNoteChart.slice(),
          },
          offset: gqlData.value.song.chart.offset,
        },
      },
      paramData: {
        songId,
        file: fileUrl,
        chartId,
      },
      userData,
      songCompleted,
    },
    props.__testingDoNotStartSong,
    props.__testingManualMode,
    editing ? 90000 : undefined // repeat
  );

  if (!init || !init.game) {
    // Only occurs during testing. We want a way to render this screen w/o starting gameplay.
    return;
  }

  game = init.game;

  if (editing) {
    init.game.editorRepeat = {
      emitAfterMs: 10000,
      emitAfterMsCallback: async () => {
        // TODO: may only need to do this once
        await query.executeQuery({ requestPolicy: "network-only" });
        init.game?.updateChart({
          tapNotes: gqlData.value.song.chart.parsedTapNoteChart.slice(),
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
  console.log("Chart Updated");
  // TODO: may only need to do this once
  query.executeQuery({ requestPolicy: "network-only" });
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
              :src="`/static/${gqlData.song.file}.png`"
              :level="gqlData.song.chart.level"
            />
            <SongTitle :title="gqlData.song.title" />
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
