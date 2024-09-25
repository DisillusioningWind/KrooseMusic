<template>
  <div class="PMain">
    <KTitleBar />
    <KNavBar v-show="!showDetail" />
    <RouterView v-show="!showDetail" />
    <PDetail />
    <KListDrawer v-model="showDrawer" />
    <KMusicBar />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
const { showDetail, showDrawer } = storeToRefs(store)
</script>

<style scoped lang="scss">
@mixin k-grid-child($nth, $row, $col) {
  &:nth-child(#{$nth}) {
    grid-row: #{$row};
    grid-column: #{$col};
  }
}

.PMain {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: grid;
  grid-template-rows: 30px calc(100% - 152px) 122px;
  grid-template-columns: min-content 1fr 0px;
  >div {
    @include k-grid-child(1, "1 / 2", "1 / 4");
    @include k-grid-child(2, "2 / 3", "1 / 2");
    @include k-grid-child(3, "2 / 3", "2 / 3");
    @include k-grid-child(4, "1 / 3", "1 / 3");
    @include k-grid-child(5, "2 / 3", "3 / 4");
    @include k-grid-child(6, "3 / 4", "1 / 4");
  }
}
</style>
