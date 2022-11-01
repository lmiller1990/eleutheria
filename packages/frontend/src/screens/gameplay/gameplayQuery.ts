import { useQuery, gql } from "@urql/vue";
import { GameplayDocument } from "../../generated/graphql";

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

export function createGameplayQuery(songId: number, chartId: number) {
  return useQuery({
    query: GameplayDocument,
    requestPolicy: "network-only",
    variables: {
      songId,
      chartId,
    },
  });
}
