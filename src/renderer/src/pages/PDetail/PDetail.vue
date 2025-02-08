<template>
  <div class="PDetail" :class="showDetail?'show':''">
    <KImage class="img" :url="mscPicURL" />
    <KLyric class="lrc" :stat="mscState" :time="mscTime" :lrcs="mscLyrics" />
  </div>
</template>

<script setup lang="ts">
import { useUIStore, useAudioStore, useInfoStore } from '@renderer/store'
const { showDetail } = storeToRefs(useUIStore())
const { mscState, mscTime } = storeToRefs(useAudioStore())
const { mscPicURL, mscLyrics } = storeToRefs(useInfoStore())
</script>

<style scoped lang="scss">
$margin-height: 12px;
$title-height: 30px;
$show-time: 0.4s;
.PDetail {
  position: relative;
  height: 100%;
  width: 100%;
  padding-top: $title-height;
  background-position: 0 (-$title-height);// 背景图片从标题栏开始
  background-repeat: no-repeat;
  background-size: 100% auto;
  background-image: v-bind('mscPicURL?("url(" + mscPicURL + ")"):"linear-gradient(150deg, #3b3b3b, #6b6b6b 20%, #ffffff)"');
  background-color: #ffffff;
  opacity: 0;
  pointer-events: none;// 不显示时不响应点击事件
  transition: opacity $show-time;
  display: grid;
  grid-template-columns: 27% 73%;
  // 模糊背景
  &::after {
    content: '';
    position: absolute;
    top: -$title-height;
    height: calc(100% + $title-height);
    width: 100%;
    background-color: #0000005f;
    backdrop-filter: blur(40px);
  }
  &.show {
    opacity: 1;
    pointer-events: auto;
  }
  // 音乐图片
  .img {
    z-index: 1;
    max-height: 300px;
    max-width: 300px;
    margin: $margin-height;
    align-self: end;
  }
  // 音乐歌词
  .lrc {
    z-index: 1;
    height: calc(100% - 2 * $margin-height);
    margin: $margin-height 0;
  }
}
</style>
