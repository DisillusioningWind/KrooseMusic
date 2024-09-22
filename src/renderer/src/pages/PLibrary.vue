<template>
  <div class="PLibrary">
    <div class="ToolBar">
      <span>当前目录</span>
      <el-dropdown v-if="curLibs.length > 0" type="primary" split-button placement="bottom-end" popper-class="k-popper" size="large">
        {{ store.curLib?.name }}
        <template #dropdown><el-dropdown-menu><el-dropdown-item v-for="lib in curLibs" :key="lib.id" @click="curLib = lib">{{ lib.name }}</el-dropdown-item></el-dropdown-menu></template>
      </el-dropdown>
    </div>
    <div class="ContentBar">
      <div class="ListBar">
        <KLibList :mode="curLib?.mode" :items="curItems" :cur-path="curItem?.path" @select="onItemSelect" />
      </div>
      <div class="DetailBar" v-if="curLib?.mode==='asmr' && curItem">
        <div class="InfoBar">
          <img :src="(curItem as ILibAlbum).pic" />
          <div class="TitleBar">
            <div>{{ curItem.name }}</div>
            <div>未知声优</div>
            <div>未知标签</div>
          </div>
        </div>
        <div class="DirListBar">
          <KDirList :dir="dirSelect" :cur-path="musicPath" @music="onDirMusic" @musics="onDirMusics"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
const { curLibs, curLib, curItems, curItem, curList, albumPath, musicPath } = storeToRefs(store)
const { loadMusic } = store
const dirSelect = ref<IDirStruc>()

async function onItemSelect(item: ILibItem) {
  if (curLib.value?.mode === 'normal' && item.path !== musicPath.value) {
    loadMusic(item.path)
    const index = curItems.value.findIndex(v => v.path === item.path)
    curList.value = curItems.value.slice(index).map((v, i) => { v['id'] = i; return v })
  } else if (curLib.value?.mode === 'asmr') {
    const res = await window.ipc.invoke('getDirStruc', item.path) as IDirStruc
    dirSelect.value = res
    albumPath.value = item.path
  }
}
function onDirMusic(path: string) {
  if (musicPath.value === path) return
  loadMusic(path)
}
function onDirMusics(musics: ILibItem[]) {
  loadMusic(musics[0].path)
  curList.value = musics.map((v, i) => ({ ...v, id: i }))
}
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';

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
      width: v-bind('curLib?.mode === "asmr" ? "40%" : "100%"');
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
        @include k-scroll-bar(scroll);
        >div { margin-bottom: 10px; }
      }
    }
  }
}
</style>
