import { createPinia, setActivePinia } from "pinia";
import { mount as _mount } from "cypress/vue";
import type { Pinia } from "pinia";
import "./commands";
import "@packages/game-data/styles/global.css";
import { useSongsStore } from "../../src/stores/songs";
import { testSong } from "../fixtures/songs";
import { createRouterMock } from 'vue-router-mock'
import "./style.css";

let pinia: Pinia;

beforeEach(() => {
  pinia = createPinia();
  setActivePinia(pinia);
  const songsStore = useSongsStore();
  songsStore.$patch((state) => {
    state.songs = [testSong];
    state.selectedSongId = testSong.id;
    state.selectedChartIdx = 0;
  });
});

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  interface Window {
    manualTick: (ms: number) => void
  }

  namespace Cypress {
    interface Chainable {
      mount: typeof _mount;
    }
  }
}

Cypress.Commands.add("mount", _mount);

type MountingOptions<T> = Parameters<typeof _mount<T>>[1]

export function mount<T>(comp: any, payload: MountingOptions<T> = {}) {
  const _props: T = {
    ...payload.props,
  } as any;

  return _mount(comp as any, {
    ...payload,
    props: _props,
    global: {
      plugins: [pinia, createRouterMock({ 
        spy: {
          create: cy.spy,
          reset: () => {}
        }
      })]
    }
  });
}


