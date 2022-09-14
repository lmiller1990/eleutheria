import { ref, shallowRef } from "vue";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";

const show = ref(false);
const component = shallowRef();

export function useModal() {
  return {
    show,
    component,
    showModal: async (type: "signUp" | "signIn" | "signOut") => {
      show.value = true;
      switch (type) {
        case "signUp":
          return (component.value = SignUpForm);
        case "signIn":
          return (component.value = SignInForm);
        case "signOut":
          const mod = await import("../screens/SongSelectScreen/Profile.vue");
          return (component.value = mod.default);
      }
    },
    hideModal: () => {
      show.value = false;
    },
  };
}
