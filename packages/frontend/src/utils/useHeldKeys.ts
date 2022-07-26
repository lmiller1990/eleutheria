import { ref } from "vue";
import { useEventListener } from "./useEventListener";

const heldKeys = ref(new Set<string>());

function keyup(event: KeyboardEvent) {
  heldKeys.value.delete(event.code);
}

function keydown(event: KeyboardEvent) {
  heldKeys.value.add(event.code);
}

export function useHeldKeys() {
  useEventListener("keyup", keyup);
  useEventListener("keydown", keydown);

  return heldKeys;
}
