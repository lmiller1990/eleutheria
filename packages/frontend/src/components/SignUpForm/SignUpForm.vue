<script lang="ts" setup>
import { ref } from "vue";
import type { SignUpFormProps } from "./types";

const username = ref("Lachlan")

const props = defineProps<SignUpFormProps>();
</script>

<template>
  <div>
    <form class="form">
      <label class="upcase">Username</label>
      <div>
        <input class="input upcase" v-model="username" />
      </div>
    </form>
  </div> 
</template>

<style>
@import "../../../../breeze-css/dist/breeze.css";
</style>

<style scoped lang="scss">
@import "../../shared.scss";

.input, .label {
  color: white !important;
}

.input {
  background: none;
  border: none;
  border-bottom: 2px solid white;
}
</style>