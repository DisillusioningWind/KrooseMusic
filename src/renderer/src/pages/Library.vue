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
        <div class="Item" v-for="item in musics" :key="item.path" v-ctx-menu="menu"
          @contextmenu="onItemContext($event.currentTarget as HTMLElement, item)" @click="onItemClick($event.currentTarget as HTMLElement, item)">
          <span v-tooltip.immediate.overflow="item.name">{{ item.name + (libCur.mode === 'normal'?(item as ILibMusic).ext:'') }}</span>
          <span v-if="libCur.mode === 'normal'" v-tooltip.immediate.overflow="(item as ILibMusic).artist">{{ (item as ILibMusic).artist }}</span>
          <span v-if="libCur.mode === 'normal'">{{ formatTime((item as ILibMusic).duration, 'mm:ss') }}</span>
        </div>
      </div>
      <div class="DetailBar" v-if="libCur.mode === 'asmr'">
        <div class="InfoBar">
          <img :src="(musicSelect as ILibAlbum)?.pic" />
          <div class="TitleBar">
            <div>{{ musicSelect?.name }}</div>
            <div>未知声优</div>
            <div>未知标签</div>
          </div>
        </div>
        <div class="DirListBar" v-if="dirSelect">
          <KRecursiveList :dir="dirSelect" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu } from '@renderer/directives/Menu'
import db from '@renderer/utils/db'
import player from '@renderer/classes/MusicPlayer'
const libs = shallowRef<ILibrary[]>([])
const libCur = ref<ILibrary>({ id: 0, name: '', path: '', mode: 'normal' })
const musics = ref<ILibItem[]>([])
const musicSelect = ref<ILibItem | null>(null)
const dirSelect = ref<IDirStruc | null>(null)
let musicContext: ILibItem | null = null
let itemSelect: HTMLElement | null = null
let itemContext: HTMLElement | null = null
let itemPlaying: HTMLElement | null = null
const menu = [
  { label: '播放', action: onItemCtxPlay },
  { label: '信息', action: () => {} },
  { label: '删除', action: () => {} },
  { label: '添加到播放列表', action: () => {} },
  { label: '在文件资源管理器中显示', action: onItemOpenInFolder },
]
onMounted(async () => {
  libs.value = await db.getLibraries()
  libCur.value = libs.value[0]
})
watch(libCur, async (val) => {
  if (!val) return
  const cnt = await db.getItemNums(val.name)
  const size = 500
  musics.value = []
  for (let i = 0; i < cnt; i += size) {
    musics.value.push(...await db.getItems(val.name, i, size))
  }
})
function onItemClick(curTarget: HTMLElement, item: ILibItem) {
  // 样式处理
  if (itemSelect) { itemSelect.classList.remove('Select') }
  if (itemPlaying) { itemPlaying.classList.remove('Play') }
  itemSelect = curTarget
  itemPlaying = curTarget
  curTarget.classList.add('Select', 'Play')
  // 数据处理
  musicSelect.value = item
  if (libCur.value.mode === 'normal' && item.path !== player.value.path) {
    player.value.load(item.path)
  } else if (libCur.value.mode === 'asmr') {
    window.ipc.invoke('getDirStruc', item.path).then((res: IDirStruc) => dirSelect.value = res)
  }
}
function onItemContext(curTarget: HTMLElement, item: ILibItem) {
  musicContext = item
  itemContext = curTarget
}
function onItemCtxPlay() {
  if (itemPlaying) { itemPlaying.classList.remove('Play') }
  itemPlaying = itemContext!
  itemPlaying.classList.add('Play')
  player.value.load(musicContext!.path)
}
function onItemOpenInFolder() {
  window.shell.showItemInFolder(musicContext!.path)
}
</script>

<style scoped lang="scss">
@mixin kScrollBar($track-color: transparent){
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
.PLibrary {
  height: 100%;
  box-sizing: border-box;
  padding-top: 10px;
  $toolBarHeight: 45px;
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
    height: calc(100% - $toolBarHeight - 10px);
    box-sizing: border-box;
    border-top: 1px solid #e5e5e5;
    margin-top: 10px;
    display: flex;
    .ListBar {
      height: 100%;
      width: v-bind('libCur.mode === "asmr" ? "40%" : "100%"');
      overflow-y: scroll;
      @include kScrollBar;
      .Item {
        height: 40px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        user-select: none;
        &.Select {
          background-color: #0078d7 !important;
          color: white;
          &:hover {
            background-color: #005a9e !important;
          }
          &:active {
            background-color: #00487e !important;
          }
        }
        &.Play:not(.Select) {
          color: #005a9e;
        }
        &:nth-child(odd) {
          background-color: #f2f2f2;
        }
        &:hover {
          background-color: #d9d9d9;
        }
        &:active {
          background-color: #aeaeae;
        }
        span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          margin-left: 10px;
          &:last-child {
            width: 50px;
            text-align: center;
            margin-right: 10px;
          }
          &:nth-child(2) {
            width: 100px;
          }
          &:first-child {
            flex: 1;
            text-align: left;
          }
        }
      }
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
          flex: 1;
          margin: $pad-width $pad-width $pad-width 0;
          height: $img-size - $pad-width * 2;
          display: flex;
          flex-direction: column;
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
        @include kScrollBar;
        >div {
          margin-bottom: 10px;
        }
      }
    }
  }
}
</style>
