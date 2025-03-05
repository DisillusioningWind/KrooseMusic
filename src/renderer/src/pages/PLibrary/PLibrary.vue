<template>
  <div class="PLibrary">
    <div class="tools" v-if="curLibs.length">
      <span class="libText">当前目录</span>
      <KLibSelect class="libSelect" v-model="curLib" :opts="curLibs" :label="'name'" />
    </div>
    <div class="contents">
      <KLibList class="mainList" :mode="curLib?.mode" :items="curItems" :path="curSelPath" @select="onItemSelect" />
      <div class="detail" v-show="curLib?.mode === 'asmr' && curAlbum">
        <KDirInfo :alb="curAlbum" />
        <KDirList class="dirList" :dir="curDirec" :path="curPath" @music="onDirMusic" @musics="onDirMusics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLibStore } from '@renderer/store'
import bus from '@renderer/utils/emitter'
const { curLibs, curLib, curItems, curItem, curAlbum, curPath, curList } = storeToRefs(useLibStore())
/** 当前专辑目录 */
const curDirec = ref<IDir>()
/** 当前选中项目路径 */
const curSelPath = computed(() => curLib.value?.mode === 'normal' ? curItem.value?.path : curAlbum.value?.path)
// 选择音乐时播放音乐并更新当前播放列表，选择专辑时更新当前专辑目录
async function onItemSelect(selIdx: number) {
  if (!curLib.value) return
  const selItem = curItems.value[selIdx]
  if (curLib.value.mode === 'normal') {
    if (curItem.value?.path === selItem.path) return
    bus.emLoadMsc(selItem.path)
    curItem.value = selItem
    curAlbum.value = undefined
    curList.value = curItems.value.slice(selIdx)
  } else if (curLib.value.mode === 'asmr') {
    if (curAlbum.value?.path === selItem.path) return
    curAlbum.value = selItem as ILibAlbum
    curDirec.value = await window.api.getDirStruc(selItem.path)
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
$msc-hei: 122px;// 音乐栏高度
$tool-hei: 45px;// 工具栏高度
$info-hei: 230px;// 信息栏高度
$cont-mar-top: 14px;// 内容区上边距
.PLibrary {
  height: calc(100% + $msc-hei);
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
      >.dirList {
        height: calc(100% - $info-hei - $msc-hei);
        padding: 0 0 10px 10px;
        @include global.k-scroll-bar;
      }
    }
  }
}
</style>
