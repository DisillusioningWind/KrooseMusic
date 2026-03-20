<template>
  <Transition name="fade">
    <div v-show="showDetail" class="PDetail" :style="background">
      <KImage class="img" :url="mscPicURL || curAlbum?.pic" />
      <KLyric class="lrc" :stat="mscState" :time="mscTime" :lrcs="mscLyrics" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useUIStore, useAudioStore, useInfoStore, useLibStore } from '@renderer/store'
const { showDetail } = storeToRefs(useUIStore())
const { mscState, mscTime } = storeToRefs(useAudioStore())
const { mscPicURL, mscLyrics } = storeToRefs(useInfoStore())
const { curAlbum } = storeToRefs(useLibStore())
const background = computed(() => ({ backgroundImage: mscPicURL.value ? `url(${mscPicURL.value})` : '' }))
</script>

<style scoped lang="scss">
$mar-size: 12px;
$title-hei: 30px;// 标题栏高度
$show-time: 0.4s;// 显示时间
.fade-enter-active, .fade-leave-active { transition: opacity $show-time; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.PDetail {
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: $title-hei;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #ffffff;
  background-image: linear-gradient(150deg, #3b3b3b, #6b6b6b 20%, #ffffff);
  display: grid;
  grid-template-columns: 27% 73%;
  // 模糊背景
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-color: #0000005f;
    backdrop-filter: blur(40px);
  }
  // 音乐图片
  .img {
    z-index: 1;
    max-height: 300px;
    max-width: 300px;
    margin: $mar-size;
    align-self: end;
  }
  // 音乐歌词
  .lrc {
    z-index: 1;
    margin: $mar-size 0;
  }
}
</style>
