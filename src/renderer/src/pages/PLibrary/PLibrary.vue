<template>
  <div class="PLibrary">
    <div class="tools">
      <span class="libText">当前目录</span>
      <KLibSelect class="libSelect" v-if="curLib" v-model="curLib" :options="libOptions" />
    </div>
    <div class="contents">
      <KLibList class="mainList" :mode="curLib?.mode" :items="curItems" :path="curLib?.mode==='normal'?curItem?.path:curAlbum?.path" @select="onItemSelect" />
      <div class="detail" v-show="curLib?.mode==='asmr'&&curAlbum">
        <div class="info">
          <KImage class="pic" :url="curAlbum?.pic" />
          <div class="title" v-tooltip.immediate.overflow="curAlbum?.name">{{ curAlbum?.name }}</div>
          <div class="tag">未知声优</div>
          <div class="tag">未知标签</div>
        </div>
        <KDirList class="dirList" :dir="dirSelect" :path="curPath" @music="onDirMusic" @musics="onDirMusics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLibStore } from '@renderer/store'
import { vTooltip } from '@renderer/directives/Tooltip'
import bus from '@renderer/utils/emitter'
const { curLibs, curLib, curItems, curItem, curAlbum, curPath, curList } = storeToRefs(useLibStore())
const dirSelect = ref<IDirStruc>()
const libOptions = computed(() => curLibs.value.map(lib => ({ label: lib.name, value: lib })))

async function onItemSelect(item: ILibItem) {
  if (!curLib.value) return
  if (curLib.value.mode === 'normal') {
    if (curItem.value?.path === item.path) return
    curItem.value = item
    curAlbum.value = undefined
    bus.emLoadMsc(item.path)
    const idx = curItems.value.findIndex(v => v.path === item.path)
    curList.value = curItems.value.slice(idx)
  } else if (curLib.value.mode === 'asmr') {
    if (curAlbum.value?.path === item.path) return
    curAlbum.value = item as ILibAlbum
    const dir = await window.api.getDirStruc(item.path)
    if (!dir) return
    dirSelect.value = dir
  }
}
function onDirMusic(music: ILibItem) {
  if (curPath.value === music.path) return
  bus.emLoadMsc(music.path)
  curItem.value = music
  curList.value = [music]
}
function onDirMusics(musics: ILibItem[]) {
  bus.emLoadMsc(musics[0].path)
  curItem.value = musics[0]
  curList.value = musics
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';
$tool-hei: 45px;
$cont-mar-top: 14px;
.PLibrary {
  height: 100%;
  padding: 0 10px;
  user-select: none;
  >.tools {
    height: $tool-hei;
    display: flex;
    align-items: center;
    // 当前目录
    >.libText {
      line-height: $tool-hei;
      font-size: 34px;
      font-weight: 300;
      margin-right: 15px;
      white-space: nowrap;
    }
    // 当前目录选择
    >.libSelect {
      height: 40px;
      max-width: 200px;
    }
  }
  >.contents {
    height: calc(100% - $tool-hei - $cont-mar-top);
    margin-top: $cont-mar-top;
    border-top: 1px solid #e5e5e5;
    display: flex;
    >.mainList { flex: 1; }
    >.detail {
      flex: 1.5;
      background-color: #f6f6f6;
      $info-hei: 230px;
      $info-pad: 10px;
      $img-size: $info-hei - $info-pad * 2;
      >.info {
        height: $info-hei;
        padding: $info-pad;
        display: grid;
        grid-template-columns: $img-size 1fr;
        grid-template-rows: min-content auto 1fr;
        gap: 4px $info-pad;
        >.pic { grid-row: 1 / 4; }
        >.tag { font-size: 15px; }
        >.title {
          font-size: 18px;
          user-select: text;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          line-clamp: 4;
          overflow: hidden;
        }
      }
      >.dirList {
        height: calc(100% - $info-hei);
        margin-left: 10px;
        padding-bottom: $info-pad;
        @include global.k-scroll-bar(scroll);
      }
    }
  }
}
</style>
