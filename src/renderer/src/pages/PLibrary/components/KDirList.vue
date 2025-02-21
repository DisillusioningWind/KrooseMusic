<template>
  <div class="KDirList" v-if="dir">
    <div class="direc" v-for="direc in dir.dirs" :key="direc.name">
      <div class="title" :style="{ paddingLeft: left*20 + 'px' }" @click="onDirClick">
        <svg class="icon"><path d="m8,6 l4,4 l-4,4" /></svg>
        <div class="name" v-tooltip.immediate.overflow="direc.name">{{ direc.name }}</div>
        <svg class="icon" @click.stop="onDirPlayClick(direc)"><path d="m7,5.5 l0,10 l8,-5z" /></svg>
        <svg class="icon" @click.stop="onDirAddClick(direc)"><path d="m4.5,10 l12,0 m-6,-6 l0,12.5" /></svg>
      </div>
      <KDirList class="subdir" :dir="direc" :path="path" :left="left+1" :style="{ '--rib-left': left*20+10 + 'px' }" @music="v=>$emit('music',v)" @musics="v=>$emit('musics',v)" />
    </div>
    <div class="music" v-for="music in dir.mscs" :key="music.name" :class="{ play: music.path === path }" @click="onMusicClick(music)">
      <span class="name" :style="{ paddingLeft: (left*20||10) + 'px' }" v-tooltip.immediate.overflow="music.name">{{ music.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
withDefaults(defineProps<{
  /** 当前目录 */ dir?: IDir,
  /** 当前歌曲 */ path?: string,
  /** 目录缩进 */ left?: number
}>(), { left: 0 })
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
function getDirMusics(dir: IDir) {
  const res = [] as ILibItem[]
  if (dir.dirs) { for (const d of dir.dirs) { res.push(...getDirMusics(d)) } }
  if (dir.mscs) { res.push(...dir.mscs) }
  return res
}
// 发射事件
function onMusicClick(music: ILibItem) { emit('music', music) }
function onDirPlayClick(dir: IDir) { emit('musics', getDirMusics(dir)) }
function onDirAddClick(_dir: IDir) { /** TODO: 添加目录到播放列表 */ }
</script>

<style scoped lang="scss">
$item-hei: 26px;
@mixin k-dir-item {
  height: $item-hei;
  display: flex;
  align-items: center;
  &:hover { background-color: #00000013; }
  >.name {
    flex: 1;
    width: 0;
    line-height: $item-hei;
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
@mixin k-dir-icon($size: 26px) {
  width: $size;
  height: $size;
  stroke: #747474;
  stroke-width: 1.5px;
  stroke-linejoin: round;
  fill: none;
}

.KDirList {
  display: flex;
  flex-direction: column;
  user-select: none;
  // 子目录列表
  >.direc {
    display: grid;
    grid-template-rows: $item-hei 1fr;
    transition: .2s;
    &.hidden { grid-template-rows: $item-hei 0fr; }
    >.title {
      @include k-dir-item;
      padding-right: 5px;
      &:hover>.icon:not(:first-child) { display: block; }
      &.hidden>.icon:first-child { transform: rotate(0deg); }
      >.icon {
        @include k-dir-icon;
        // 展开标识
        &:first-child {
          height: 20px;
          width: 20px;
          transform: rotate(90deg);
          transition: .2s;
        }
        &:not(:first-child) {
          display: none;
          padding: 3px;
          &:hover { background-color: #bdbdbd; }
          &:active { background-color: #a0a0a0; }
        }
      }
    }
    >.subdir {
      position: relative;
      min-height: 0;
      overflow: hidden;
      &::before {
        position: absolute;
        content: '';
        top: 0;
        left: var(--rib-left);
        height: 100%;
        width: 0.5px;
        pointer-events: none;
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
