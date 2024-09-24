<template>
  <div class="PDetail">
    <KImage class="img" :url="store.musicPicURL" />
    <KLyric class="lrc" :stat="store.playerState" :time="store.musicCurTime" :lrcs="store.musicLyrics" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
</script>

<style scoped lang="scss">
$margin-height: 12px;

.PDetail {
  height: 100%;
  width: 100%;
  display: flex;
  .img {
    width: 27%;
    margin: $margin-height;
    max-width: 300px;
    max-height: 300px;
    align-self: flex-end;
  }
  .lrc {
    width: 73%;
    height: calc(100% - 2 * $margin-height);
    margin: $margin-height 0;
  }
}
</style>
