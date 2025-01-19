<template>
  <button class="KLoopBtn" @click="onClick">{{ list[idx].tip }}</button>
</template>

<script setup lang="ts">
const mode = defineModel<LoopMode>({ required: true })
const list = [
  { tip: '列表播放', val: 'listOnce' },
  { tip: '列表循环', val: 'listLoop' },
  { tip: '单曲循环', val: 'singleLoop' },
  { tip: '随机播放', val: 'random' }
] as { tip: string, val: LoopMode }[]
const idx = computed(() => list.findIndex(v => v.val === mode.value))
function onClick() { mode.value = list[(idx.value + 1) % list.length].val }
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
