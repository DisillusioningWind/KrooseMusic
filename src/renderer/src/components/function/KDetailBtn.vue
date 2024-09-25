<template>
  <div class="KDetailBtn">
    <KImage v-show="showPic" class="img" :url="picURL" />
    <div class="inf">
      <span class="title" :text="title" @mouseenter="onMouseEnter">{{ title }}</span>
      <span class="artist" :text="artist" @mouseenter="onMouseEnter">{{ artist }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title?: string, artist?: string, picURL?: string, showPic?: boolean }>()
const title = computed(() => props.title || '')
const artist = computed(() => props.artist || '')
const picURL = computed(() => props.picURL || '')
const showPic = computed(() => props.showPic)
const loopKeyframes = [
  { transform: 'translateX(0%)' },
  { transform: 'translateX(calc(-100% - 25px))' }
]
let loopTimer: NodeJS.Timeout | null = null
// 鼠标进入时文字循环滚动
function onMouseEnter(e: MouseEvent) {
  const target = e.target as HTMLElement
  // 能全部显示或正在滚动则返回
  if (target.parentElement!.offsetWidth >= target.scrollWidth || loopTimer) return
  const loopOption = {
    duration: target.scrollWidth * 30,
    easing: 'linear',
    iterations: 1
  }
  target.classList.add('scroll')
  target.animate(loopKeyframes, loopOption)
  loopTimer = setTimeout(() => {
    target.classList.remove('scroll')
    loopTimer = null
  }, loopOption.duration)
}
</script>

<style scoped lang="scss">
$btn-height: 90px;
$margin-width: 12px;
$after-left: 25px;
@mixin k-text($size, $weight) {
  position: relative;
  font-size: $size;
  font-weight: $weight;
  color: white;
  white-space: nowrap;
  &.scroll::after {
    content: attr(text);
    position: absolute;
    padding-left: $after-left;
    top: 0;
    left: 100%;
  }
}

.KDetailBtn {
  height: $btn-height;
  width: fit-content;
  max-width: 100%;
  user-select: none;
  display: flex;
  &:hover { background-color: #00000030; }
  &:active { background-color: #00000050; }
  .img {
    flex-shrink: 0;
    width: $btn-height;
  }
  .inf {
    margin: 0 $margin-width;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .title { @include k-text(17.5px, 100); }
    .artist { @include k-text(15px, 600); }
  }
}
</style>
