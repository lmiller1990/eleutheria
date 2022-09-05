<template>
  <div class="gray-3 border-1 rounded-xl" id="song-info">
    <div class="flex" id="song-info-inner">
      <table>
        <tr>
          <th>Notes</th>
          <td>5000</td>
        </tr>
        <tr>
          <th>BPM</th>
          <td>185</td>
        </tr>
        <tr>
          <th>Duration</th>
          <td>4:10</td>
        </tr>
      </table>

      <div class="flex flex-col items-center justify-center w-full">
        <div id="best-grade" class="font-3rem">AAA</div>

        <div id="best-score">95.50%</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped lang="scss">
#song-info {
  width: 100%;
  padding: 5px;
  font-size: 1.25rem;
}

#song-info-inner {
  padding: 5px;
}

.octogon {
  clip-path: polygon(
    5% 0,
    95% 0,
    100% 10%,
    100% 90%,
    95% 100%,
    5% 100%,
    0 90%,
    0 10%
  );
}

table {
  border-collapse: separate;
  border-spacing: 5px;
}

th {
  text-align: left;
  color: white;
}

td {
  text-align: center;
  background: rgb(37 8 1);
  color: white;
  padding: 0 5px;
  border-radius: 4px;
}

#best-grade {
  color: lightgoldenrodyellow;
  text-shadow: 0px 10px 10px black;
}
</style>
