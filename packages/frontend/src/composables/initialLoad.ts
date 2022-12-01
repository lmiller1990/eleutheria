import { onMounted, readonly, ref } from "vue";

const initial = ref(true);

export function useInitialLoad() {
  onMounted(() => {
    initial.value = false;
  });

  return {
    initial: readonly(initial),
  };
}
