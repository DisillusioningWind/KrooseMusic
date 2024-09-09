<template>
  <div class="PLibrary">
    <div class="ToolBar">
      <span>当前目录</span>
      <el-dropdown v-if="store.curLibs.length > 0" type="primary" split-button placement="bottom-end" popper-class="k-popper" size="large">
        {{ store.curLib?.name }}
        <template #dropdown><el-dropdown-menu><el-dropdown-item v-for="lib in store.curLibs" :key="lib.id" @click="store.curLib = lib">{{ lib.name }}</el-dropdown-item></el-dropdown-menu></template>
      </el-dropdown>
    </div>
    <div class="ContentBar">
      <div class="ListBar">
        <KLibList :mode="store.curLib?.mode" :items="store.curItems" :cur-path="store.curItem?.path" @select="onItemSelect" />
      </div>
      <div class="DetailBar" v-if="store.curLib?.mode==='asmr' && store.curItem">
        <div class="InfoBar">
          <img :src="(store.curItem as ILibAlbum).pic" />
          <div class="TitleBar">
            <div>{{ store.curItem!.name }}</div>
            <div>未知声优</div>
            <div>未知标签</div>
          </div>
        </div>
        <div class="DirListBar">
          <KDirList :dir="dirSelect" :cur-path="player.path" @music="onDirMusic" @musics="onDirMusics"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import db from '@renderer/utils/db'
import player from '@renderer/classes/MusicPlayer'
const store = useStore()
const dirSelect = ref<IDirStruc>()
onMounted(async () => {
  const libLen = store.curLibs.length
  store.curLibs = await db.getLibraries()
  if (libLen === 0 && store.curLibs.length > 0) {
    store.curLib = store.curLibs[0]
  }
})

async function onItemSelect(item: ILibItem) {
  if (store.curLib?.mode === 'normal' && item.path !== player.value.path) {
    player.value.load(item.path)
    const index = store.curItems.findIndex(v => v.path === item.path)
    store.curList = store.curItems.slice(index).map((v, i) => { v['id'] = i; return v })
  } else if (store.curLib?.mode === 'asmr') {
    const res = await window.ipc.invoke('getDirStruc', item.path) as IDirStruc
    dirSelect.value = res
    store.albumPath = item.path
  }
}
function onDirMusic(path: string) {
  if (player.value.path === path) return
  player.value.load(path)
}
function onDirMusics(musics: ILibItem[]) {
  player.value.load(musics[0].path)
  store.curList = musics.map((v, i) => ({ ...v, id: i }))
}
</script>

<style scoped lang="scss">
@mixin KScrollBar($track-color: transparent){
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bababa;
    &:hover {
      background-color: #8c8c8c;
    }
    &:active {
      background-color: #5d5d5d;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: $track-color;
  }
}
$toolBarHeight: 45px;
$conBarMarginTop: 14px;
.PLibrary {
  height: 100%;
  box-sizing: border-box;
  padding: 0 10px;
  user-select: none;
  .ToolBar {
    height: $toolBarHeight;
    display: flex;
    align-items: center;
    >span {
      line-height: $toolBarHeight;
      font-size: 34px;
      font-weight: 300;
      margin-right: 15px;
      white-space: nowrap;
    }
    :deep(>.el-dropdown) {
      .el-button-group {
        .el-button {
          &:first-child {
            max-width: 135px;
            span {
              overflow: hidden;
              font-size: 18px;
              line-height: 40px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
  }
  .ContentBar {
    height: calc(100% - $toolBarHeight - $conBarMarginTop);
    margin-top: $conBarMarginTop;
    box-sizing: border-box;
    border-top: 1px solid #e5e5e5;
    display: flex;
    .ListBar {
      height: 100%;
      width: v-bind('store.curLib?.mode === "asmr" ? "40%" : "100%"');
    }
    .DetailBar {
      flex: 1;
      $img-size: 230px;
      $pad-width: 10px;
      .InfoBar {
        background-color: #f6f6f6;
        display: flex;
        >img {
          width: $img-size;
          height: $img-size;
          box-sizing: border-box;
          padding: $pad-width;
          object-fit: cover;
        }
        .TitleBar {
          height: $img-size - $pad-width * 2;
          flex: 1;
          margin: $pad-width $pad-width $pad-width 0;
          display: flex;
          flex-direction: column;
          user-select: text;
          >div {
            max-width: 100%;
            font-size: 15px;
            &:first-child {
              font-size: 18px;
              margin-bottom: 4px;
              overflow: hidden;
            }
          }
        }
      }
      .DirListBar {
        width: 100%;
        height: calc(100% - $img-size);
        background-color: #f6f6f6;
        overflow-y: scroll;
        @include KScrollBar;
        >div {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
