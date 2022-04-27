import { Summary } from "@packages/engine";
import { defineStore } from "pinia";

interface SummaryState {
  summary?: Summary;
}

export const useSummaryStore = defineStore("summary", {
  state(): SummaryState {
    return {
      summary: {
        timing: {
          absolute: {
            count: 405,
            early: 0,
            late: 0,
          },
          miss: {
            count: 10,
            early: 0,
            late: 0,
          },
          perfect: {
            count: 350,
            early: 0,
            late: 0,
          },
          great: {
            count: 250,
            early: 120,
            late: 130,
          },
        },
      },
    };
  },

  actions: {
    setSummary(summary: Summary) {
      this.summary = summary;
    },
  },
});
