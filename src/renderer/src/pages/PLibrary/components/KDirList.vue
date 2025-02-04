<template>
  <div class="KDirList" v-if="dir">
    <div class="direc" v-for="direc in dir.dirs" :key="direc.name">
      <div class="title" :style="{ paddingLeft: (left||0)*20 + 'px' }" @click="onDirClick">
        <svg class="icon"><path d="m8,6 l4,4 l-4,4" /></svg>
        <div class="name" v-tooltip.immediate.overflow="direc.name">{{ direc.name }}</div>
        <svg class="icon" @click.stop="onDirPlayClick(direc)"><path d="m7,5.5 l0,10 l8,-5z" /></svg>
        <svg class="icon" @click.stop="onDirAddClick(direc)"><path d="m4.5,10 l12,0 m-6,-6 l0,12.5" /></svg>
      </div>
      <KDirList class="subList" :dir="direc" :path="path" :left="left?left+1:1" @music="v=>$emit('music', v)" @musics="v=>$emit('musics', v)" />
    </div>
    <div class="music" v-for="music in dir.musics" :key="music.name" :class="{ play: music.path === path }" :style="{ paddingLeft: (left||0)*20 + 'px' }" @click="onMusicClick(music)">
      <div class="name" v-tooltip.immediate.overflow="music.name">{{ music.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
defineProps<{
  /** 当前目录 */ dir?: IDirStruc,
  /** 当前歌曲 */ path?: string,
  /** 子目录缩进，顶层不需要传入 */ left?: number
}>()
const emit = defineEmits<{
  /** 歌曲点击 */ music: [value: ILibItem],
  /** 目录点击 */ musics: [value: ILibItem[]]
}>()
// 点击目录展开/收起
function onDirClick(e: MouseEvent) {
  const title = e.currentTarget as HTMLElement
  const direc = title.parentElement as HTMLElement
  title.classList.toggle('hidden')
  direc.classList.toggle('hidden')
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
$item-height: 26px;
@mixin k-dir-item {
  height: $item-height;
  display: flex;
  align-items: center;
  &:hover { background-color: #00000013; }
  >.name {
    width: 0;
    flex: 1;
    line-height: $item-height;
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
  // 子目录列表
  >.direc {
    display: grid;
    grid-template-rows: $item-height 1fr;
    transition: .2s;
    &.hidden { grid-template-rows: $item-height 0fr; }
    >.title {
      @include k-dir-item;
      padding-right: 5px;
      >.icon {
        $svg-size: 20px;
        width: $svg-size;
        height: $svg-size;
        stroke: #747474;
        stroke-width: 1.5px;
        stroke-linejoin: round;
        fill: none;
        // 展开标识
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
      &:hover>.icon:not(:first-child) { display: block; }
      &.hidden>.icon:first-child { transform: rotate(0deg); }
    }
    >.subList {
      position: relative;
      min-height: 0;
      overflow: hidden;
      &::before {
        position: absolute;
        content: '';
        top: 0;
        left: v-bind('(left||0)*20-10 + "px"');
        height: 100%;
        width: 0.5px;
        background-color: #747474;
      }
    }
  }
  // 歌曲列表
  >.music {
    @include k-dir-item;
    &.play {
      background-color: #00000013;
      color: #005a9e;
    }
  }
}
</style>
