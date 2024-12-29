<template>
  <div class="KLyric" ref="list" @scroll="scrolling" @scrollend="scrollend">
    <span v-for="(item, i) in lrcs" :key="item.uid" :class="i==idx?'active':''">{{ item.lyric }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 播放器状态 */
  stat: string,
  /** 当前播放时间 */
  time: number,
  /** 歌词列表 */
  lrcs: ILyric[]
}>()
const stat = computed(() => props.stat)
const time = computed(() => props.time)
const lrcs = computed(() => props.lrcs)
const list = ref<HTMLElement>()
const idx = ref(0)
let scrollAuto = false
let scrollUser = false
let scrollTimer: NodeJS.Timeout | null = null
// 根据当前时间自动滚动歌词
watch(time, (val) => {
  idx.value = lrcs.value.findLastIndex(item => item.time <= val)
})
watch(idx, (newIdx, oldIdx) => {
  if (newIdx === oldIdx || scrollUser) { return }
  scrollAuto = true
  list.value?.scrollTo({ top: (newIdx - 10) * 24, behavior: 'smooth' })
})
// 鼠标滚动时停止自动滚动
function scrolling() {
  if (scrollAuto) { return }
  if (scrollTimer) { clearTimeout(scrollTimer) }
  scrollUser = true
  scrollTimer = setTimeout(() => {
    scrollUser = false
    if (stat.value !== 'play') { return }
    // 延迟结束后立即自动滚动，仅当播放状态时
    scrollAuto = true
    list.value?.scrollTo({ top: (idx.value - 10) * 24, behavior: 'smooth' })
  }, 6000)
}
function scrollend() { if (scrollAuto) scrollAuto = false }
</script>

<style scoped lang="scss">
$span-height: 24px;

.KLyric {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  overflow: auto;
  &::-webkit-scrollbar { width: 15px; }
  &::-webkit-scrollbar-thumb {
    background: linear-gradient(to right, transparent 0 6px, #cdcdcd 6px 9px, transparent 9px 15px);
    &:hover { background-color: #cdcdcd; }
    &:active { background: none; background-color: #fff; }
  }
  >span {
    line-height: $span-height;
    font-size: 18px;
    font-weight: 500;
    color: #bdbdbd;
    text-shadow: 0 0.5px 0 #484848;
    text-align: center;
    &:empty { min-height: $span-height; }
    &.active {
      color: #fff;
      text-shadow: none;
    }
  }
}
</style>
