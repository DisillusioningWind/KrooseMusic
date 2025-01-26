<template>
  <button class="KLoopBtn" v-tooltip="list[mode]" @click.stop="onClick">
    {{ list[mode] }}
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
  color: white;
  background-color: transparent;
  &:hover { background-color: #00000030; }
  &:active { background-color: #00000050; }
  >svg {
    height: 100%;
    width: 100%;
    stroke: white;
  }
}
</style>
