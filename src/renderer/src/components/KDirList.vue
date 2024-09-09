<template>
  <div class="KDirList" v-if="dir">
    <div class="DirBar" v-for="direc in dir.dirs" :key="direc.name">
      <div class="Dir" @click="onDirClick">
        <svg><path d="m8,6 l4,4 l-4,4" /></svg>
        <span v-tooltip.immediate.overflow="direc.name">{{ direc.name }}</span>
        <svg @click="onPlayClick($event,direc)"><path d="m7,5.5 l0,10 l8,-5z" /></svg>
        <svg @click="onAddClick($event,direc)"><path d="m4.5,10 l12,0 m-6,-6 l0,12.5" /></svg>
      </div>
      <div class="DirList">
        <KDirList :dir="direc" :cur-path="curPath" :left="left?left+1:1"
          @music="v => $emit('music', v)" @musics="v => $emit('musics', v)"/>
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
  dir?: IDirStruc,
  /** 当前播放歌曲 */
  curPath?: string,
  /** 子目录缩进，顶层不需要传入 */
  left?: number
}>()
const emit = defineEmits<{
  /** 歌曲点击 */
  music: [value: string],
  /** 目录点击 */
  musics: [value: ILibItem[]]
}>()
function onDirClick(e: MouseEvent) {
  const dir = e.currentTarget as HTMLElement
  const dirList = dir.nextElementSibling as HTMLElement
  if (dir.classList.contains('Hidden')) {
    dir.classList.remove('Hidden')
    dirList.classList.remove('Hidden')
  } else {
    dir.classList.add('Hidden')
    dirList.classList.add('Hidden')
  }
}
function getDirMusics(dir: IDirStruc) {
  const res = [] as ILibItem[]
  if (dir.dirs) {
    for (const d of dir.dirs) {
      res.push(...getDirMusics(d))
    }
  }
  if (dir.musics) {
    res.push(...dir.musics)
  }
  return res
}
function onPlayClick(e: MouseEvent, direc: IDirStruc) {
  e.stopPropagation()
  const musics = getDirMusics(direc)
  emit('musics', musics)
}
// TODO: 添加目录为播放列表
function onAddClick(e: MouseEvent, _direc: IDirStruc) {
  e.stopPropagation()
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
    >svg:not(:first-child) {
      display: block;
    }
  }
  >span {
    width: 0;
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
      padding-right: 5px;
      >svg {
        $svgSize: 20px;
        width: $svgSize;
        height: $svgSize;
        align-self: center;
        stroke: #747474;
        stroke-width: 1.5px;
        stroke-linejoin: round;
        fill: none;
        &:first-child {
          transition: .2s;
          transform: rotate(90deg);
        }
        &:not(:first-child) {
          padding: 3px;
          display: none;
          &:hover {
            background-color: #bdbdbd;
          }
          &:active {
            background-color: #a0a0a0;
          }
        }
      }
      &.Hidden {
        >svg:first-child {
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
