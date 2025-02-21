<template>
  <div class="KDirInfo">
    <KImage class="cover" :url="alb?.pic" />
    <div class="title" v-tooltip.immediate.overflow="alb?.name">{{ alb?.name }}</div>
    <div class="tag">未知声优</div>
    <div class="tag">未知标签</div>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
defineProps<{
  /** 当前专辑 */ alb?: ILibAlbum
}>()
</script>

<style scoped lang="scss">
$info-hei: 230px;
$info-pad: 10px;
$img-size: $info-hei - 2 * $info-pad;
.KDirInfo {
  height: $info-hei;
  padding: $info-pad;
  display: grid;
  grid-template-columns: $img-size 1fr;
  grid-template-rows: min-content auto 1fr;
  gap: 4px $info-pad;
  >.cover { grid-row: 1 / 4; }
  >.tag { font-size: 15px; }
  >.title {
    font-size: 18px;
    user-select: text;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-clamp: 4;
    overflow: hidden;
  }
}
</style>
