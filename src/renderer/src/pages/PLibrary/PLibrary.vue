<template>
  <div class="PLibrary">
    <div class="tools" v-if="curLibs.length">
      <span class="libText">当前目录</span>
      <KLibSelect class="libSelect" v-model="curLib" :opts="curLibs" :label="'name'" />
    </div>
    <div class="contents">
      <KLibList class="mainList" :mode="curLib?.mode" :items="curItems" :path="curSelPath" @select="onItemSelect" @play="onItemPlay" />
      <div class="detail" v-show="curLib?.mode === 'asmr' && selectAlbum">
        <KDirInfo :alb="selectAlbum" />
        <KDirList class="dirList" :dir="curDirec" :path="playMusic?.path" @music="onDirMusic" @musics="onDirMusics" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLibraryManager, getAudioManager, getSessionManager } from '@renderer/store'

const audioManager = getAudioManager()
const sessionManager = getSessionManager()
const { curLibs, curLib, curItems } = storeToRefs(getLibraryManager())
const { playMusic, playAlbum } = storeToRefs(sessionManager)
const selectAlbum = ref<ILibAlbum>()
/** 当前专辑目录 */
const curDirec = ref<IDir>()
/** 当前选中项目路径 */
const curSelPath = computed(() => curLib.value?.mode === 'normal' ? playMusic.value?.path : playAlbum.value?.path)

// 选择音乐时播放音乐并更新当前播放列表，选择专辑时更新当前专辑目录
async function onItemSelect(idx: number) {
  if (!curLib.value) {
    return
  }

  const selectItem = curItems.value[idx]

  if (curLib.value.mode === 'normal') {
    if (playMusic.value?.path === selectItem.path) {
      return
    }

    playMusic.value = selectItem
    sessionManager.updatePlayQueue(curItems.value.slice(idx))
    audioManager.load(selectItem.path)
  } else if (curLib.value.mode === 'asmr') {
    if (selectAlbum.value?.path === selectItem.path) {
      return
    }

    selectAlbum.value = selectItem as ILibAlbum
    curDirec.value = await window.api.scan.getDirStruc(selectItem.path)
  }
}
async function onItemPlay(idx: number) {
  if (!curLib.value) {
    return
  }

  const selectItem = curItems.value[idx]

  if (curLib.value.mode === 'normal') {
    playMusic.value = selectItem
    sessionManager.updatePlayQueue([selectItem])
    audioManager.load(selectItem.path)
  } else if (curLib.value.mode === 'asmr') {
    selectAlbum.value = selectItem as ILibAlbum
    curDirec.value = await window.api.scan.getDirStruc(selectItem.path)
    if (curDirec.value === undefined) {
      console.error(`onItemPlay failed: cannot find curDirec, curDirec.path=${selectItem.path}`)
      return
    }
    onDirMusics(curDirec.value.mscs)
  }
}
function onDirMusic(music: ILibItem) {
  if (playMusic.value?.path === music.path) {
    return
  }
  playAlbum.value = selectAlbum.value
  sessionManager.updatePlayQueue([music])
  audioManager.load(music.path)
}
function onDirMusics(musics: ILibItem[]) {
  playAlbum.value = selectAlbum.value
  sessionManager.updatePlayQueue(musics)
  audioManager.load(musics[0].path)
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/var' as *;
@use '@renderer/assets/style' as *;
$tool-hei: 45px;// 工具栏高度
$info-hei: 230px;// 信息栏高度
$cont-top: 14px;// 内容区上边距
.PLibrary {
  height: calc(100% + $music-hei);
  padding: 0 10px;
  user-select: none;
  >.tools {
    height: $tool-hei;
    display: flex;
    align-items: center;
    >.libText {
      line-height: $tool-hei;
      font-size: 34px;
      font-weight: 300;
      margin-right: 15px;
      white-space: nowrap;
    }
    >.libSelect {
      height: 40px;
      max-width: 200px;
    }
  }
  >.contents {
    height: calc(100% - $tool-hei - $cont-top);
    margin-top: $cont-top;
    border-top: 1px solid #e5e5e5;
    display: flex;
    >.mainList { flex: 1; }
    >.detail {
      flex: 1.5;
      background-color: #f6f6f6;
      >.dirList {
        height: calc(100% - $info-hei - $music-hei);
        padding: 0 0 10px 10px;
        @include k-scrollbar;
      }
    }
  }
}
</style>
