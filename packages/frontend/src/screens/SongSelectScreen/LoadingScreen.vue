<script lang="ts" setup>
import { Logo } from "../../components/NonGameplayScreen/Logo";
</script>

<template>
  <div class="absolute h-screen w-screen top-0 left-0 bg-zinc-500 z-10">
    <div class="bg-zinc-700 w-full text-white flex justify-center">
      <div class="flex flex-col items-center h-screen justify-center pb-24">
        <div
          class="max-width w-full flex justify-center items-center pb-4 text-6xl"
        >
          <Logo />
        </div>
        <span class="text-3xl">Loading...</span>
      </div>
    </div>
  </div>
</template>
