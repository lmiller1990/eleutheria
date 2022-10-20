import { gql, useQuery } from "@urql/vue";
import { defineComponent } from "vue";
import { useRoute } from "vue-router";
import { SummaryScreenContainer_GetSummaryDocument } from "../../generated/graphql";
import { SummaryScreenContainer } from "./SummaryScreenContainer";
import { Timing } from "../gameplay/components/Gameplay/GameplayScore";

gql`
  query SummaryScreenContainer_GetSummary($id: Int!) {
    summary(id: $id) {
      id
      timing
      percent
      personalBest
      chart {
        id
        level
        song {
          id
          title
        }
      }
    }
  }
`;

export const SummaryWrapper = defineComponent({
  async setup() {
    const route = useRoute();

    if (!route.query.id) {
      throw Error(
        `Expected route.query.id to be a string, got ${route.query.id}`
      );
    }

    const gqlData = await useQuery({
      query: SummaryScreenContainer_GetSummaryDocument,
      variables: { id: parseInt(route.query.id as string, 10) },
    });

    if (!gqlData.data.value?.summary?.chart) {
      throw Error(`Expected summary.chart to exist`);
    }

    const timingData = JSON.parse(gqlData.data.value?.summary?.timing ?? "{}");

    const timing: Timing[] = [
      {
        window: "absolute",
        count: timingData.absolute.count,
      },
      {
        window: "perfect",
        count: timingData.perfect.count,
      },
      {
        window: "miss",
        count: timingData.miss.count,
      },
    ];

    const render = (
      <SummaryScreenContainer
        percent={gqlData.data.value.summary.percent}
        timing={timing}
        level={gqlData.data.value.summary.chart.level}
        songTitle={gqlData.data.value.summary.chart.song.title}
        records={{
          personal: "XX.XX",
          world: "YY.YY",
        }}
      />
    );

    return () => render;
  },
});
