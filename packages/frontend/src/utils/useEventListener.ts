import { onMounted, onUnmounted } from "vue";

type Handler = (...args: any[]) => void;

export function useEventListener(
  event: keyof WindowEventMap,
  handler: Handler
) {
  onMounted(() => {
    window.addEventListener(event, handler);
  });

  onUnmounted(() => {
    window.removeEventListener(event, handler);
  });
}
