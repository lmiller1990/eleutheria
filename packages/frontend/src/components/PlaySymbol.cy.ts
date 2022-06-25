import { h } from 'vue'
import PlaySymbol from './PlaySymbol.vue'

describe('PlaySymbol.cy.ts', () => {
  it('playground', () => {
    const Parent = h('div', { style: `height: 150px; width: 220px; background: black;` }, h(PlaySymbol))
    cy.mount(() => Parent)
  })
})