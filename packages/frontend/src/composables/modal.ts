import { ref, shallowRef } from "vue";
import SignUpForm from "../components/SignUpForm";

const show = ref(false);
const component = shallowRef();

function getModalElement() {
  const el = document.getElementById("modal");
  if (!el) {
    throw Error(`Could not find element with id="modal"`);
  }
  return el;
}

function hideModalRaw() {
  const el = getModalElement();
  el.classList.remove("visible");
  el.classList.add("invisible");
}

function showModalRaw() {
  const el = getModalElement();
  el.classList.remove("invisible");
  el.classList.add("visible");
}

export function useModal() {
  return {
    show,
    component,
    showModal: (type: "signUp") => {
      // showModalRaw();
      show.value = true;
      switch (type) {
        case "signUp":
          return (component.value = SignUpForm);
      }
    },
    hideModal: () => {
      // hideModalRaw();
      show.value = false;
    },
  };
}
