import type { Cover, NoteSkin } from "@packages/shared";
import { gql } from "@urql/core";
import {
  defineComponent,
  FunctionalComponent,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  Ref,
  Suspense,
} from "vue";
import { useGameplayOptions } from "../../composables/gameplayOptions";
import { CoverParams } from "../gameplay/modiferManager";
import { ScrollDirection } from "../gameplay/types";
import { OptionsModalDocument } from "../../generated/graphql";
import { useQuery } from "@urql/vue";
import {
  injectNoteSkin,
  injectStylesheet,
  stylesheetInjectionKeys,
} from "../../plugins/injectGlobalCssVars";
import { getStyleByClass } from "../../components/ModifierPanel/css";
import dedent from "dedent";
import { create, StartGameArgs, StartGame } from "../gameplay/gameplay";
import "../../style.css";

gql`
  query OptionsModal {
    noteSkins {
      id
      name
      css
    }
    covers {
      id
      name
      thumbnailColor
      css
      code
    }
  }
`;

function extractCss(style: string) {
  return getStyleByClass(style, ".note");
}

const overrideStyles = dedent`
  #targets, .col {
    height: 100%;
  }

  :root {
    /* 50% smaller */
    --note-height: 25px;
    --col-width: 35px;
    --target-height: var(--note-height);
  }
`;

const noteStyle = dedent`
  height: 30px;
  width: 50px;
`;

const CoverSkinModPanel: FunctionalComponent<{
  covers: OptionsModalProps["covers"];
  onChangeMod: OptionsModalProps["onChangeCoverMod"];
}> = (props) => {
  return (
    <OptionsPanel title="Cover Style" selected={""}>
      <div class="flex">
        {props.covers.map((x) => {
          return (
            <div class="flex flex-col items-center mr-2">
              <button
                class="h-6 w-10 border border-white"
                onClick={() => props.onChangeMod(x)}
                style={{ background: x.thumbnailColor }}
              />
              <label class="text-xs mt-1 font-light">{x.name}</label>
            </div>
          );
        })}
      </div>
    </OptionsPanel>
  );
};

const NoteSkinModPanel: FunctionalComponent<{
  noteSkins: OptionsModalProps["noteSkins"];
  modValue: OptionsModalProps["currentNoteSkin"];
  onChangeMod: OptionsModalProps["onChangeNoteSkin"];
}> = (props) => {
  return (
    <OptionsPanel title="Note" selected={""}>
      <div class="flex">
        {props.noteSkins.map((x) => {
          const style = extractCss(x.css) + noteStyle;
          return (
            <div class="flex flex-col items-center mr-2">
              <button style={style} onClick={() => props.onChangeMod(x)} />
              <label class="text-xs mt-1 font-light">{x.name}</label>
            </div>
          );
        })}
      </div>
    </OptionsPanel>
  );
};

const ScrollModPanel: FunctionalComponent<{
  modValue: OptionsModalProps["currentScrollMod"];
  onChangeMod: OptionsModalProps["onChangeScrollMod"];
}> = (props) => {
  function onClick(event: Event, direction: ScrollDirection) {
    event.preventDefault();
    props.onChangeMod(direction);
  }

  return (
    <OptionsPanel title="Scroll" selected={props.modValue.toUpperCase()}>
      <div class="flex">
        {(["up", "down"] as const).map((dir) => (
          <button
            class="bg-zinc-700 text-sm border border-bg-black text-white py-1 w-14 mr-2"
            onClick={(event) => onClick(event, dir)}
          >
            {dir}
          </button>
        ))}
      </div>
    </OptionsPanel>
  );
};

const CoverOffsetModPanel: FunctionalComponent<{
  onChangeMod: OptionsModalProps["onChangeCoverMod"];
  modValue: OptionsModalProps["currentCover"];
  id: string;
}> = (props) => {
  const options = Array(101)
    .fill(undefined)
    .reduce<JSX.Element[]>((acc, _curr, idx) => {
      const value = idx;
      if (value % 10 === 0) {
        return acc.concat(
          <option value={value} label={`${value}%`} key={value} />
        );
      }
      return acc;
    }, []);

  function input(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    props.onChangeMod({ offset: value });
  }

  return (
    <OptionsPanel title="Cover Height" selected={`${props.modValue.offset}%`}>
      <Slider
        options={options}
        max={100}
        value={props.modValue.offset}
        step={1}
        id="cover-offset"
        onInput={input}
      />
    </OptionsPanel>
  );
};

const Slider: FunctionalComponent<{
  onInput: (event: Event) => void;
  id: string;
  options: JSX.Element[];
  step: number;
  max: number;
  value: number;
}> = (props) => {
  return (
    <>
      <input
        {...props}
        min={0}
        list={`${props.id}-tickmarks`}
        name={props.id}
        type="range"
        class="w-full"
      />
      <datalist
        id={`${props.id}-tickmarks`}
        class="flex justify-between w-full text-xs"
      >
        {props.options}
      </datalist>
    </>
  );
};

const SpeedModPanel: FunctionalComponent<{
  onChangeMod: OptionsModalProps["onChangeSpeedMod"];
  modValue: OptionsModalProps["currentSpeedMod"];
  id: string;
}> = (props) => {
  const options = Array(101)
    .fill(undefined)
    .reduce<JSX.Element[]>((acc, _curr, idx) => {
      const value = idx * 10;
      if (value % 100 === 0) {
        return acc.concat(
          <option value={value} label={value.toString()} key={value} />
        );
      }
      return acc;
    }, []);

  function input(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    props.onChangeMod(value);
  }

  return (
    <OptionsPanel title="Speed" selected={props.modValue}>
      <Slider
        options={options}
        value={props.modValue}
        max={1000}
        step={10}
        id="speed-mod"
        onInput={input}
      />
    </OptionsPanel>
  );
};

const OptionsPanel: FunctionalComponent<{
  title: string;
  selected: string | number;
}> = (props, { slots }) => {
  return (
    <div class="w-full text-white text-lg p-2 bg-neutral-600 mt-2 border border-black">
      <div class="flex justify-between w-full my-1">
        <div>{props.title}</div>
        <div>{props.selected}</div>
      </div>
      <div>{slots.default?.()}</div>
    </div>
  );
};

interface OptionsModalProps {
  gameplayRoot: Ref<HTMLDivElement | undefined>;

  currentSpeedMod: number;
  onChangeSpeedMod: (val: number) => void;

  currentScrollMod: ScrollDirection;
  onChangeScrollMod: (val: ScrollDirection) => void;

  currentCover: CoverParams;
  onChangeCoverMod: (cover: Partial<CoverParams>) => void;

  noteSkins: NoteSkin[];
  currentNoteSkin: NoteSkin;
  onChangeNoteSkin: (val: NoteSkin) => void;

  covers: Cover[];
}

const Col: FunctionalComponent = (_props, { slots }) => (
  <div class="h-full flex flex-col justify-center mx-10">
    {slots.default?.()}
  </div>
);

export const OptionsPane: FunctionalComponent<OptionsModalProps> = (props) => {
  function stopPropagation(e: Event) {
    e.stopPropagation();
  }

  return (
    <div
      style={{ background: "#828282", height: "75vh" }}
      class="flex px-14 border border-white"
      onClick={stopPropagation}
    >
      <Col>
        <h2 class="text-3xl">Options</h2>
        <SpeedModPanel
          onChangeMod={props.onChangeSpeedMod}
          modValue={props.currentSpeedMod}
          id="speed-mod"
        />
        <ScrollModPanel
          onChangeMod={props.onChangeScrollMod}
          modValue={props.currentScrollMod}
        />
        <NoteSkinModPanel
          noteSkins={props.noteSkins}
          onChangeMod={props.onChangeNoteSkin}
          modValue={props.currentNoteSkin}
        />
        <CoverOffsetModPanel
          onChangeMod={props.onChangeCoverMod}
          modValue={props.currentCover}
          id="cover-offset"
        />
        <CoverSkinModPanel
          covers={props.covers}
          onChangeMod={props.onChangeCoverMod}
        />
      </Col>
      <Col>
        <div style="height: 85%">
          <div ref={props.gameplayRoot} class="h-full" />
        </div>
      </Col>
    </div>
  );
};

export const OptionsModal: FunctionalComponent = () => {
  const slots = {
    default: () => <OptionsModalWrapper />,
    fallback: () => <div>Loading...</div>,
  };

  return <Suspense v-slots={slots} />;
};

export const OptionsModalWrapper = defineComponent({
  async setup() {
    const modifiers = useGameplayOptions();
    const gameplayRoot = ref(undefined);
    const { modifierManager } = useGameplayOptions();
    let game: StartGame | void;

    injectStylesheet(overrideStyles, stylesheetInjectionKeys.modsPaneOverrides);

    const fileUrl = import.meta.env.PROD
      ? `${import.meta.env.VITE_CDN_URL}/empty.mp3`
      : `/static/empty.mp3`;

    onMounted(() => {
      const startGameArgs: StartGameArgs = {
        userData: {
          css: "",
          js: "",
        },
        noteCulling: true,
        modifierManager,
        songCompleted: () => {},
        updateSummary: () => {},
        paramData: {
          file: fileUrl,
          songId: "",
          chartId: "",
        },
        songData: {
          chart: {
            offset: 0,
            parsedTapNoteChart: {
              tapNotes: Array(1000)
                .fill(undefined)
                .map((_x, idx) => ({
                  id: idx.toString(),
                  ms: 500 * idx,
                  column: idx % 6,
                  measureNumber: 0,
                  char: "x",
                })),
            },
          },
        },
      };
      game = create(gameplayRoot.value!, startGameArgs, false, false, 0);
      game!.start();
    });

    onBeforeUnmount(() => {
      // This also cleans up any injected stylesheets.
      game?.stop();
    });

    const onChangeNoteSkin = (noteSkin: NoteSkin) => {
      injectNoteSkin(noteSkin);
      modifiers.handleChangeNoteSkin(noteSkin);
    };

    const localMods = reactive({
      speed: modifiers.modifierManager.multiplier,
      scroll: modifiers.modifierManager.scrollDirection,
      cover: modifiers.modifierManager.cover,
      noteSkin: modifiers.modifierManager.noteSkin,
    });

    modifiers.modifierManager.on("set:multiplier", (val) => {
      localMods.speed = val;
    });

    modifiers.modifierManager.on("set:scrollDirection", (val) => {
      localMods.scroll = val;
    });

    modifiers.modifierManager.on("set:cover", (val, oldVal) => {
      localMods.cover = { ...oldVal, ...val };
    });

    modifiers.modifierManager.on("set:noteSkin", (val) => {
      localMods.noteSkin = val;
    });

    const gql = await useQuery({ query: OptionsModalDocument });

    const defaultNoteSkin = gql.data.value?.noteSkins.find(
      (x) => x.name === "default"
    );

    if (!defaultNoteSkin) {
      throw Error(
        `Default note skin not found. This should not happen. Note skins are ${gql.data.value?.noteSkins}`
      );
    }

    return () => (
      <OptionsPane
        gameplayRoot={gameplayRoot}
        currentCover={localMods.cover}
        currentSpeedMod={localMods.speed}
        currentScrollMod={localMods.scroll}
        onChangeSpeedMod={modifiers.handleChangeSpeedMod}
        onChangeScrollMod={modifiers.handleChangeScrollMod}
        onChangeCoverMod={modifiers.handleChangeCoverMod}
        noteSkins={gql.data.value?.noteSkins ?? []}
        covers={gql.data.value?.covers ?? []}
        currentNoteSkin={localMods.noteSkin}
        onChangeNoteSkin={onChangeNoteSkin}
      />
    );
  },
});
