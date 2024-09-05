<template>
  <div class="PLibrary">
    <div class="ToolBar">
      <span>当前目录</span>
      <el-dropdown type="primary" split-button placement="bottom-end" popper-class="k-popper" size="large">
        {{ libCur?.name }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in libs" :key="item.id" @click="libCur = item">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="ContentBar">
      <div class="ListBar">
        <KLibList :mode="libCur.mode" :items="items" :cur="itemSelect" @select="onItemSelect" />
      </div>
      <div class="DetailBar" v-if="libCur.mode==='asmr'&&dirSelect">
        <div class="InfoBar">
          <img :src="(itemSelect as ILibAlbum)?.pic" />
          <div class="TitleBar">
            <div>{{ itemSelect?.name }}</div>
            <div>未知声优</div>
            <div>未知标签</div>
          </div>
        </div>
        <div class="DirListBar">
          <KDirList :dir="dirSelect" :cur-path="player.path" @music="onDirMusic"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import db from '@renderer/utils/db'
import player from '@renderer/classes/MusicPlayer'
const libs = shallowRef<ILibrary[]>([])
const libCur = ref<ILibrary>({ id: 0, name: '', path: '', mode: 'normal' })
const items = ref<ILibItem[]>([])
const itemSelect = ref<ILibItem>()
const dirSelect = ref<IDirStruc>()
onMounted(async () => {
  libs.value = await db.getLibraries()
  libCur.value = libs.value[0]
})
watch(libCur, async (val) => {
  // 获取当前表格数据
  const cnt = await db.getItemNums(val.name)
  const size = 500
  items.value = []
  for (let i = 0; i < cnt; i += size) {
    items.value.push(...await db.getItems(val.name, i, size))
  }
  // 清空不需要数据
  if (val.mode === 'normal') {
    dirSelect.value = undefined
  }
})
function onItemSelect(item: ILibItem) {
  itemSelect.value = item
  if (libCur.value.mode === 'normal' && item.path !== player.value.path) {
    player.value.load(item.path)
  } else if (libCur.value.mode === 'asmr') {
    window.ipc.invoke('getDirStruc', item.path).then((res: IDirStruc) => dirSelect.value = res)
  }
}
function onDirMusic(path: string) {
  if (player.value.path === path) return
  player.value.load(path)
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
      width: v-bind('libCur.mode === "asmr" ? "40%" : "100%"');
      overflow-y: scroll;
      @include KScrollBar;
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
