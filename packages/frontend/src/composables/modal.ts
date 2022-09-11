import { ref, shallowRef } from "vue";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";

const show = ref(false);
const component = shallowRef();

export function useModal() {
  return {
    show,
    component,
    showModal: (type: "signUp" | "signIn") => {
      show.value = true;
      switch (type) {
        case "signUp":
          return (component.value = SignUpForm);
        case "signIn":
          return (component.value = SignInForm);
      }
    },
    hideModal: () => {
      show.value = false;
    },
  };
}
