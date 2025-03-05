<template>
  <div class="KLyric" ref="list" @scroll="scrolling" @scrollend="scrollend">
    <span v-for="item, idx in lrcs" class="lrc" :class="{ active: idx === curIdx }">{{ item.lyric }}</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 播放状态 */ stat: AudioState,
  /** 当前进度 */ time: number,
  /** 歌词列表 */ lrcs: ILyric[]
}>()
const list = ref<HTMLDivElement>()// 歌词列表元素
const curIdx = computed(() => props.lrcs.findLastIndex(item => item.time <= props.time))// 当前歌词索引
let scrollAuto = false// 是否正在自动滚动
let scrollUser = false// 是否正在用户滚动
let scrollTimer: NodeJS.Timeout | undefined// 滚动计时器
// 根据当前索引自动滚动歌词列表
watch(curIdx, curIdx => {
  if (scrollUser) return
  scrollAuto = true
  list.value?.scrollTo({ top: (curIdx - 10) * 24, behavior: 'smooth' })
})
function scrollend() { scrollAuto = false }
// 用户鼠标滚动时停止自动滚动
function scrolling() {
  if (scrollAuto) return
  clearTimeout(scrollTimer)
  scrollUser = true
  scrollTimer = setTimeout(() => {
    scrollUser = false
    if (props.stat !== 'play') return
    // 延迟结束后立即自动滚动，仅当播放状态时
    scrollAuto = true
    list.value?.scrollTo({ top: (curIdx.value - 10) * 24, behavior: 'smooth' })
  }, 6000)
}
</script>

<style scoped lang="scss">
$lrc-hei: 24px;
.KLyric {
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
  >.lrc {
    line-height: $lrc-hei;
    font-size: 18px;
    font-weight: 500;
    color: #bdbdbd;
    text-shadow: 0 0.5px 0 #484848;
    text-align: center;
    &:empty { min-height: $lrc-hei; }
    &.active { color: #fff; }
  }
}
</style>
