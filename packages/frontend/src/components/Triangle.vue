<script setup lang="ts">
defineProps<{
  fill?: string;
}>();
</script>

<template>
  <svg
    width="17"
    height="19"
    viewBox="0 0 17 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16 7.76795C17.3333 8.53775 17.3333 10.4622 16 11.232L3.25001 18.5933C1.91667 19.3631 0.250006 18.4008 0.250006 16.8612L0.250006 2.13878C0.250006 0.599183 1.91667 -0.363068 3.25 0.406732L16 7.76795Z"
      :fill="fill ?? '#F7F7F7'"
    />
  </svg>
</template>
