import { Summary } from "@packages/shared";
import { defineStore } from "pinia";

interface SummaryState {
  summary: Summary | undefined;
}

export const useSummaryStore = defineStore("summary", {
  state(): SummaryState {
    return {
      summary: undefined,
    };
  },

  actions: {
    setSummary(summary: Summary) {
      this.summary = summary;
    },
  },
});
