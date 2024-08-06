<template>
  <div class="KLyric">
    <div class="List" ref="list" @wheel="startScroll">
      <span v-for="(item, i) in store.musicLyrics" :key="item.uid" :class=" i == index ? 'active' : ''">
        {{ item.lyric }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
const list = ref<HTMLElement | null>(null)
const index = ref(0)
let scrolled = false
// 根据当前时间自动滚动歌词
watch(() => store.musicCurTime, (val) => {
  index.value = store.musicLyrics.findIndex((item) => item.time >= val) - 1
  if (index.value >= 0 && !scrolled) {
    list.value?.scrollTo({
      top: (index.value - 10) * 22,
      behavior: 'smooth'
    })
  }
})
// 鼠标滚动时停止自动滚动
function startScroll() {
  scrolled = true
  setTimeout(() => {
    scrolled = false
  }, 7000)
}
</script>

<style scoped lang="scss">
.KLyric {
  height: 100%;
  width: 100%;
  position: relative;
  .List {
    height: 100%;
    width: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    overflow: auto;
    span {
      font-size: 18px;
      font-weight: 500;
      text-shadow: 0 0.5px 0 #484848;
      text-align: center;
      color: #bdbdbd;
      &:empty {
        min-height: 22px;
      }
      &.active {
        color: #fff;
        text-shadow: none;
        filter: brightness(1.5);
      }
    }
    &::-webkit-scrollbar {
      width: 15px;
      background-color: transparent;
    }
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #cdcdcd;
      background-clip: padding-box;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      &:hover {
        background-clip: border-box;
      }
      &:active {
        background-color: #fff;
      }
    }
  }
}
</style>
