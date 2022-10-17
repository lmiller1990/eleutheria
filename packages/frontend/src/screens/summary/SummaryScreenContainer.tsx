import { FunctionalComponent } from "vue";
import { useRouter } from "vue-router";
import NonGameplayScreen from "../../components/NonGameplayScreen";
import {
  GameplayScore,
  Timing,
} from "../gameplay/components/Gameplay/GameplayScore";
import { SongTitle } from "../gameplay/components/Gameplay/SongTitle";
import { SongImage } from "../SongSelectScreen/SongImage";
import "./SummaryScreenContainer.css";

interface Props {
  percent: string;
  level: number;
  timing: Timing[];
  songTitle: string;
  records: {
    personal: string;
    world: string;
  };
}

const RecordScore: FunctionalComponent<{ label: string; score: string }> = (
  props
) => {
  return (
    <div class="flex justify-between text-3xl text-white mb-4">
      <div>{props.label}</div>
      <div>{props.score}%</div>
    </div>
  );
};

const Button: FunctionalComponent<{ onClick?: () => void }> = (
  props,
  { slots }
) => {
  return (
    <button
      class="bg-zinc-700 text-white text-xl flex justify-center items-center rounded-md h-12 p-4 m-2 mt-8 w-32"
      onClick={props.onClick}
    >
      {slots.default?.()}
    </button>
  );
};

export const SummaryScreenContainer: FunctionalComponent<Props> = (props) => {
  const router = useRouter();

  return (
    <NonGameplayScreen screenTitle="Evaluation">
      <div class="flex flex-col">
        <div class="summary-wrapper">
          <div>
            <SongImage
              src="https://i1.sndcdn.com/artworks-I25aaV3g3bIRnsV2-jJchQg-t500x500.jpg"
              level={props.level}
            />
            <div class="my-5">
              <SongTitle title={props.songTitle} />
            </div>
            <div>
              <RecordScore label="Your Record" score={props.records.personal} />
              <RecordScore label="World Record" score={props.records.world} />
            </div>
          </div>

          <div>
            <div class="flex justify-center">
              <GameplayScore
                percent={props.percent}
                timing={props.timing}
                classes={{ wrapper: "text-4xl", percent: "text-7xl" }}
              />
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <Button onClick={() => router.push("/")}>Retry</Button>
          <Button onClick={() => router.push("/")}>Next Song</Button>
        </div>
      </div>
    </NonGameplayScreen>
  );
};
