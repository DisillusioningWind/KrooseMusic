<template>
  <div class="KDirList" v-if="dir">
    <div class="direc" v-for="direc in dir.dirs" :key="direc.name">
      <div class="title" @click="onDirClick">
        <svg><path d="m8,6 l4,4 l-4,4" /></svg>
        <span v-tooltip.immediate.overflow="direc.name">{{ direc.name }}</span>
        <svg @click.stop="onDirPlayClick(direc)"><path d="m7,5.5 l0,10 l8,-5z" /></svg>
        <svg @click.stop="onDirAddClick(direc)"><path d="m4.5,10 l12,0 m-6,-6 l0,12.5" /></svg>
      </div>
      <div class="list">
        <KDirList :dir="direc" :path="path" :left="left?left+1:1" @music="v => $emit('music', v)" @musics="v => $emit('musics', v)" />
      </div>
    </div>
    <div class="music" v-for="music in dir.musics" :key="music.name" :class="music.path===path?'play':''" @click="onMusicClick(music)">
      <span v-tooltip.immediate.overflow="music.name">{{ music.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
defineProps<{
  /** 当前目录 */
  dir?: IDirStruc,
  /** 当前歌曲 */
  path?: string,
  /** 子目录缩进，顶层不需要传入 */
  left?: number
}>()
const emit = defineEmits<{
  /** 歌曲点击 */
  music: [value: ILibItem],
  /** 目录点击 */
  musics: [value: ILibItem[]]
}>()
// 点击目录展开/收起
function onDirClick(e: MouseEvent) {
  const dir = e.currentTarget as HTMLElement
  const dirList = dir.nextElementSibling as HTMLElement
  if (dir.classList.contains('hidden')) {
    dir.classList.remove('hidden')
    dirList.classList.remove('hidden')
  } else {
    dir.classList.add('hidden')
    dirList.classList.add('hidden')
  }
}
function getDirMusics(dir: IDirStruc) {
  const res = [] as ILibItem[]
  if (dir.dirs) { for (const d of dir.dirs) { res.push(...getDirMusics(d)) } }
  if (dir.musics) { res.push(...dir.musics) }
  return res
}
// 发射事件
function onMusicClick(music: ILibItem) { emit('music', music) }
function onDirPlayClick(dir: IDirStruc) { emit('musics', getDirMusics(dir)) }
function onDirAddClick(_dir: IDirStruc) { /** TODO: 添加目录到播放列表 */ }
</script>

<style scoped lang="scss">
@mixin topItem {
  $item-height: 26px;
  height: $item-height;
  line-height: $item-height;
  margin-left: 10px;
  padding-left: v-bind('(left?left:0)*20 + "px"');
  display: flex;
  &:hover {
    background-color: #e4e4e4;
    >svg:not(:first-child) { display: block; }
  }
  >span {
    width: 0;
    flex: 1;
    font-size: 14px;
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
  // 子目录列表
  .direc {
    .title {
      @include topItem;
      padding-right: 5px;
      >svg {
        $svg-size: 20px;
        width: $svg-size;
        height: $svg-size;
        align-self: center;
        stroke: #747474;
        stroke-width: 1.5px;
        stroke-linejoin: round;
        fill: none;
        // 展开三角
        &:first-child {
          transform: rotate(90deg);
          transition: .2s;
        }
        &:not(:first-child) {
          padding: 3px;
          display: none;
          &:hover { background-color: #bdbdbd; }
          &:active { background-color: #a0a0a0; }
        }
      }
      // 折叠三角
      &.hidden>svg:first-child {
        transform: rotate(0deg);
        transition: .2s;
      }
    }
    .list {
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
          left: v-bind('(left?left:0)*20 + "px"');
          height: 100%;
          width: 1px;
          background-color: #747474;
          transition: .2s;
        }
      }
      &.hidden {
        grid-template-rows: 0fr;
        transition: .2s;
        >div::before {
          height: 0;
          transition: .2s;
        }
      }
    }
  }
  // 歌曲列表
  .music {
    @include topItem;
    padding-left: v-bind('(left?left*20:10) + "px"');
    box-sizing: border-box;
    &.play {
      background-color: #e4e4e4;
      color: #005a9e;
    }
  }
}
</style>
