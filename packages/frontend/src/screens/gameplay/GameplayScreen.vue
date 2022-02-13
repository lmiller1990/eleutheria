<template>
  <div id="game-app" v-once>
    <button id="start">Start</button>
    <button id="stop">Stop</button>
    <table id="debug">
      <tr>
        <th>Live notes</th>
        <td id="debug-live-notes"></td>
        <th>FPS</th>
        <td id="debug-fps"></td>
      </tr>
    </table>

    <div id="targets">
      <div id="timing"></div>
      <div id="target-line">
        <div class="target-col" id="target-col-0"></div>
        <div class="target-col" id="target-col-1"></div>
        <div class="target-col" id="target-col-2"></div>
        <div class="target-col" id="target-col-3"></div>
      </div>
      <div class="col" id="col-0"></div>
      <div class="col" id="col-1"></div>
      <div class="col" id="col-2"></div>
      <div class="col" id="col-3"></div>
      <div id="timing"></div>
      <div id="combo"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import "../../style.css";

onMounted(() => {
  import("./gameplay");
});
</script>
