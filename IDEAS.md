I want to figure out the v1 API.

Class based?

```ts
const game = new Game(config: Config, song: Song, {
  onCancel: () => {
  },

  onUpdate: () => {

  },

  onDebug: () => {

  },
})

game.start()
game.end()
```

Functional?

```ts
import { createGame, gameLoop, updateState, configure } from './game'

configure(config)

const game = createGame(song: song)

gameLoop((state) => {


  const updatedState = updateState(state)

  return gameLoop(updatedState)
})
```