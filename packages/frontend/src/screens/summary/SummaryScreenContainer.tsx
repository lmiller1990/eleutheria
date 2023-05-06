import { FunctionalComponent } from "vue";
import { useRouter } from "vue-router";
import cs from "classnames";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import {
  GameplayScoreWithAnimation,
  Timing,
} from "../gameplay/components/Gameplay/GameplayScore";
import { SongTitle } from "../gameplay/components/Gameplay/SongTitle";
import SongImage from "../SongSelectScreen/SongImage.vue";

interface Props {
  percent: number;
  level: number;
  timing: Timing[];
  songTitle: string;
  file: string;
  records: {
    personal?: number;
    world?: number;
  };
}

const RecordScore: FunctionalComponent<{
  label: string;
  score?: number;
  summaryScore: number;
}> = (props) => {
  const newRecord = props.score && props.summaryScore >= props.score;
  const scoreToShow = newRecord ? props.summaryScore : props.score;

  return (
    <div class="flex justify-between text-2xl text-white mb-4 relative">
      <div>{props.label}</div>
      <div>{scoreToShow ? `${scoreToShow.toFixed(2)}%` : "-"}</div>
      {newRecord && (
        <div
          class={cs(
            { "text-yellow-100 animate-pulse-fast": newRecord },
            "absolute"
          )}
          style={{ right: "-120px" }}
        >
          Updated!
        </div>
      )}
    </div>
  );
};

const Button: FunctionalComponent<{ onClick?: () => void }> = (
  props,
  { slots }
) => {
  return (
    <button
      class="bg-zinc-700 text-white text-xl flex justify-center items-center rounded-md h-12 p-4 mt-8 w-32"
      onClick={props.onClick}
    >
      {slots.default?.()}
    </button>
  );
};

export const SummaryScreenContainer: FunctionalComponent<Props> = (props) => {
  const router = useRouter();
  return (
    <NonGameplayScreen>
      <div class="flex flex-col">
        <div class="summary-wrapper grid grid-cols-[0.7fr_1fr] short:grid-cols-[0.5fr_0.5fr]">
          <div>
            <SongImage file={props.file} level={props.level} />
            <div class="my-5">
              <SongTitle title={props.songTitle} />
            </div>
            <div>
              <RecordScore
                label="Your Record"
                score={props.records.personal}
                summaryScore={props.percent}
              />
              <RecordScore
                label="World Record"
                score={props.records.world}
                summaryScore={props.percent}
              />
            </div>
          </div>

          <div class="flex justify-center">
            <div class="flex flex-col items-end">
              <GameplayScoreWithAnimation
                percent={props.percent}
                timing={props.timing}
                classes={{
                  wrapper: "text-xl tall:text-3xl",
                  percent: "text-4xl tall:text-7xl",
                }}
              />
              <div class="flex justify-center">
                <Button onClick={() => router.push("/")}>Continue</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </NonGameplayScreen>
  );
};
