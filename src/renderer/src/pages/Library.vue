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
          <span v-tooltip.immediate.overflow="item.name">{{ item.name }}</span>
          <span v-tooltip.immediate.overflow="item.artist">{{ item.artist }}</span>
          <span>{{ formatTime(item.duration, 'mm:ss') }}</span>
        </div>
      </div>
      <div class="DetailBar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import db from '@renderer/utils/db'
import player from '@renderer/classes/MusicPlayer'
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu } from '@renderer/directives/Menu'
const libs = shallowRef<ILibrary[]>([])
const musics = ref<ILibMusic[]>([])
const libCur = ref<ILibrary | null>(null)
let musicContext: ILibMusic | null = null
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
  const cnt = await db.getMusicNums(val.name)
  const size = 500
  for (let i = 0; i < cnt; i += size) {
    musics.value.push(...await db.getMusics(val.name, i, size))
  }
})
function onItemClick(curTarget: HTMLElement, item: ILibMusic) {
  if (itemSelect) { itemSelect.classList.remove('Select') }
  if (itemPlaying) { itemPlaying.classList.remove('Play') }
  itemSelect = curTarget
  itemPlaying = curTarget
  curTarget.classList.add('Select', 'Play')
  if (item.path !== player.value.Path) { player.value.load(item.path) }
}
function onItemContext(curTarget: HTMLElement, item: ILibMusic) {
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
      font-size: 34px;
      font-weight: 300;
      margin-right: 15px;
    }
    :deep(>.el-dropdown) {
      .el-button-group {
        .el-button {
          &:first-child {
            span {
              font-size: 18px;
              line-height: 40px;
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
      overflow-y: scroll;
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
          &:first-child {
            flex: 1;
          }
          &:nth-child(2) {
            width: 100px;
          }
          &:last-child {
            width: 50px;
            text-align: center;
            margin-right: 10px;
          }
        }
      }
    }
    .DetailBar {
      flex: 1;
    }
  }
}
</style>
