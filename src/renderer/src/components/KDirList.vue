<template>
  <div class="KDirList">
    <div class="DirBar" v-for="direc in dir.dirs" :key="direc.name">
      <div class="Dir" :ref="direc.name" @click="onDirClick(($refs[direc.name] as any)[0] as HTMLElement)">
        <svg><path d="m8,6 l4,4 l-4,4" /></svg>
        <span v-tooltip.immediate.overflow="direc.name">{{ direc.name }}</span>
      </div>
      <div class="DirList">
        <KDirList :dir="direc" :cur-path="curPath" :left="left?left+1:1" @music="v => $emit('music', v)"/>
      </div>
    </div>
    <div class="MusicBar" v-for="music in dir.musics" :key="music.name" :class="music.path === curPath?'Play':''" @click="onMusicClick(music)">
      <span v-tooltip.immediate.overflow="music.name">{{ music.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
defineProps<{
  /** 当前目录 */
  dir: IDirStruc,
  /** 当前播放歌曲 */
  curPath?: string,
  /** 子目录缩进，顶层不需要传入 */
  left?: number
}>()
const emit = defineEmits<{
  /** 歌曲点击 */
  music: [value: string]
}>()
function onDirClick(item: HTMLElement) {
  const dirList = item.nextElementSibling as HTMLElement
  if (item.classList.contains('Hidden')) {
    item.classList.remove('Hidden')
    dirList.classList.remove('Hidden')
  } else {
    item.classList.add('Hidden')
    dirList.classList.add('Hidden')
  }
}
function onMusicClick(music: { name: string, path: string }) {
  emit('music', music.path)
}
</script>

<style scoped lang="scss">
@mixin topItem {
  $itemHeight: 26px;
  height: $itemHeight;
  line-height: $itemHeight;
  margin-left: 10px;
  padding-left: v-bind('(left?left:0) * 20 + "px"');
  display: flex;
  &:hover {
    background-color: #e4e4e4;
  }
  >span {
    width: 100px;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.KDirList {
  display: flex;
  flex-direction: column;
  user-select: none;
  background-color: #f6f6f6;
  >div {
    font-size: 14px;
  }
  .DirBar {
    .Dir {
      @include topItem;
      >svg {
        $svgSize: 20px;
        width: $svgSize;
        height: $svgSize;
        align-self: center;
        stroke: #747474;
        stroke-width: 1.5px;
        stroke-linejoin: round;
        fill: none;
        transition: .2s;
        transform: rotate(90deg);
      }
      &.Hidden {
        >svg {
          transform: rotate(0deg);
          transition: transform .2s;
        }
      }
    }
    .DirList {
      position: relative;
      display: grid;
      grid-template-rows: 1fr;
      overflow: hidden;
      transition: .2s;
      >div {
        min-height: 0;
        &::before {
          position: absolute;
          z-index: 1;
          content: '';
          top: 0;
          left: v-bind('(left?left:0) * 20 + "px"');
          height: 100%;
          width: 1px;
          background-color: #747474;
          transition: .2s;
        }
      }
      &.Hidden {
        grid-template-rows: 0fr;
        transition: .2s;
        >div {
          &::before {
            height: 0;
            transition: .2s;
          }
        }
      }
    }
  }
  .MusicBar {
    @include topItem;
    padding-left: v-bind('(left?left * 20:10) + "px"');
    box-sizing: border-box;
    &.Play {
      background-color: #e4e4e4;
      color: #005a9e;
    }
  }
}
</style>
