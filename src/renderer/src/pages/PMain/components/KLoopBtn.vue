<template>
  <button class="KLoopBtn" v-tooltip="list[mode]" @click.stop="onClick">
    <svg class="icon" v-if="list[mode]==='列表播放'">
      <path d="m9,12 h12" />
      <path d="m9,17 h12" />
      <path d="m9,22 h12" />
      <path d="m24,11 v12" />
      <path d="m24,23 l2,-2 h-2 z" fill="white" />
    </svg>
    <svg class="icon" v-else-if="list[mode]==='列表循环'||list[mode]==='单曲循环'">
      <path d="m10,22 a 6 6 0 0 1 3,-10 h10" />
      <path d="m24,14 a 6 6 0 0 1 -3,10 h-10" />
      <path d="m23,12 l-2,2 l0,-4 z" fill="white" />
      <path d="m11,24 l2,-2 l0,4 z" fill="white" />
      <text class="text" v-if="list[mode]==='单曲循环'" x="49%" y="59%">1</text>
    </svg>
    <svg class="icon" v-else-if="list[mode]==='随机播放'">
      <path d="m9,21 Q14 20,16 17 T23 13" />
      <path d="m9,13 Q15 14,15 16" />
      <path d="m17,18 Q17 20,23 21" />
      <path d="m24,13 l-2,2 l0,-4 z" />
      <path d="m24,21 l-2,2 l0,-4 z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
const mode = defineModel<LoopMode>({ required: true })
const list = [ '列表播放', '列表循环', '单曲循环', '随机播放' ]
function onClick() { mode.value = (mode.value + 1) % list.length as LoopMode }
</script>

<style scoped lang="scss">
$size: 35px;
.KLoopBtn {
  height: $size;
  width: $size;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  &:hover { background-color: #00000030; }
  &:active { background-color: #00000050; }
  >.icon {
    height: 100%;
    width: 100%;
    stroke: white;
    stroke-width: 1.5px;
    stroke-linejoin: round;
    fill: transparent;
    >.text {
      text-anchor: middle;
      font-family: 'Microsoft YaHei';
      font-size: 7px;
      font-weight: 100;
      stroke-width: 0.5px;
    }
  }
}
</style>
