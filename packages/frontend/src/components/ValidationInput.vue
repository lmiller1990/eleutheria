<script lang="ts" setup>
import { ref, watchEffect } from "vue";
import { ValidatorFn, validate, ValidationResult } from "../validation";

const props = defineProps<{
  label: string;
  rules: ValidatorFn[];
  modelValue: string;
  type?: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "validate", value: ValidationResult): void;
}>();

const status = ref<ValidationResult>({
  valid: false,
  validations: [],
});

watchEffect(() => {
  const s = validate(props.modelValue, props.rules);
  status.value = s;
  emit("validate", s);
});
</script>

<template>
  <div class="flex p-8 text-3xl justify-center" :data-cy="`${props.label}`">
    <label class="mr-12" :for="props.label">{{ props.label }}</label>
    <div class="flex flex-grow flex-col">
      <input
        class="input bg-transparent border-b-2 border-white"
        :value="props.modelValue"
        :name="label"
        :id="props.label"
        :type="type ?? 'text'"
        @input="e => emit('update:modelValue', (e.target as HTMLInputElement).value)"
      />
      <div class="flex justify-end text-base">
        <div class="validation flex">
          <div
            v-for="rule of status.validations"
            :role="rule.valid ? '' : 'error'"
            :key="rule.label"
            class="pl-2"
            :class="{
              'text-green-400': rule.valid,
            }"
          >
            {{ rule.label }}.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
