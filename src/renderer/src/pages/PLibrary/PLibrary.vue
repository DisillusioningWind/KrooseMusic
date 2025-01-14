<template>
  <div class="PLibrary">
    <div class="ToolBar">
      <span>当前目录</span>
      <KLibSelect class="LibSelect" v-model="curLibName" :options="libOptions" />
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
          <KDirList :dir="dirSelect" :path="mscPath" @music="onDirMusic" @musics="onDirMusics"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore, useInfoStore } from '@renderer/store'
import bus from '@renderer/utils/emitter'
const { curLibs, curLib, curItems, curItem, curList } = storeToRefs(useStore())
const { mscPath } = storeToRefs(useInfoStore())
const dirSelect = ref<IDirStruc>()
const libOptions = computed(() => curLibs.value.map(lib => ({ label: lib.name, value: lib.name })))
const curLibName = computed({
  get: () => curLib.value?.name || '',
  set: (name: string) => { curLib.value = curLibs.value.find(lib => lib.name === name) }
})

async function onItemSelect(item: ILibItem) {
  curItem.value = item
  if (curLib.value?.mode === 'normal' && item.path !== mscPath.value) {
    bus.emLoadMsc(item.path)
    const index = curItems.value.findIndex(v => v.path === item.path)
    curList.value = curItems.value.slice(index).map((v, i) => { v['id'] = i; return v })
  } else if (curLib.value?.mode === 'asmr') {
    const res = await window.ipc.invoke('getDirStruc', item.path) as IDirStruc
    dirSelect.value = res
  }
}
function onDirMusic(music: ILibItem) {
  if (mscPath.value === music.path) return
  bus.emLoadMsc(music.path)
}
function onDirMusics(musics: ILibItem[]) {
  bus.emLoadMsc(musics[0].path)
  curList.value = musics.map((v, i) => ({ ...v, id: i }))
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';
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
    // 当前目录
    >span {
      line-height: $toolBarHeight;
      font-size: 34px;
      font-weight: 300;
      margin-right: 15px;
      white-space: nowrap;
    }
    // 当前目录选择
    >.LibSelect {
      height: 40px;
      max-width: 200px;
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
        @include global.k-scroll-bar(scroll);
        >div { margin-bottom: 10px; }
      }
    }
  }
}
</style>
