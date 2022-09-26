<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { reactive, ref } from "vue";
import Button from "../Button.vue";
import ValidationInput from "../ValidationInput.vue";
import { gql } from "@urql/core";
import { useMutation } from "@urql/vue";
import { SignInForm_SignInDocument } from "../../generated/graphql";
import { useModal } from "../../composables/modal";

gql`
  mutation SignInForm_SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      viewer {
        username
        id
      }
    }
  }
`;

const modal = useModal();

const form = reactive({
  email: {
    value: "a@b.c",
    valid: false,
  },
  password: {
    value: "password",
    valid: false,
  },
});

const valid = computed(
  () => form.email.value.length && form.password.value.length
);

const submitting = ref(false);

const error = ref<string | undefined>();

const signIn = useMutation(SignInForm_SignInDocument);

function handleSignUp () {
  modal.showModal('signUp')
}

async function handleSubmit() {
  const res = await signIn.executeMutation({
    email: form.email.value,
    password: form.password.value,
  });

  if (res.error?.graphQLErrors?.[0]) {
    error.value = res.error?.graphQLErrors?.[0].message;
  } else {
    modal.hideModal();
  }
}
</script>

<template>
  <form
    class="w-full form text-white h-full flex flex-col items-center p-8"
    @submit.prevent="handleSubmit"
  >
    <ValidationInput
      v-model="form.email.value"
      :rules="[]"
      label="email"
      @validate="(result) => (form.email.valid = result.valid)"
    />

    <ValidationInput
      v-model="form.password.value"
      :rules="[]"
      label="password"
      type="password"
      @validate="(result) => (form.password.valid = result.valid)"
    />

    <Button type="submit" :disabled="!valid || submitting">Submit</Button>

    <div v-if="error" class="pt-5 text-red-300">{{ error }}</div>

    <div class="pt-5">
      New Here? <button class="underline" @click="handleSignUp">Sign Up</button>.
    </div>
  </form>
</template>

<style scoped lang="scss">
.form {
  background: #373737;
  @apply max-w-3xl;
}
</style>
