import { readonly, ref } from "vue";

const visible = ref(false);

export function useOptionsModal() {
  return {
    close: () => (visible.value = false),
    open: () => (visible.value = true),
    visible,
  };
}
