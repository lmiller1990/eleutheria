## Editing Charts

1. Pick the song
2. Navigate it
3. Launch editing mutation

```graphql
mutation Editing {
  # This is one of the Abyss Breaker charts
  # Figure it out by looking at the database or migrations
  startEditing (chartId: 10) 
}
```

4. Go to `Gameplay.vue` and comment back in

```js
  if (true) {
    init.game.editorRepeat = {
  // ...
```