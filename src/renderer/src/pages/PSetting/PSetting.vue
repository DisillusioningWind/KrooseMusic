<template>
  <div class="PSetting">
    <p class="PTitle">设置</p>
    <KSetting title="音乐目录">
      <div class="Library">
        <div v-for="lib in curLibs" :key="lib.id">
          <span v-tooltip.immediate.overflow="lib.name">{{ lib.name }}</span>
          <span v-tooltip.immediate.overflow="lib.path">{{ lib.path }}</span>
          <span>模式</span>
          <span>{{ lib.mode==='normal'?'普通':'ASMR' }}</span>
          <button @click="onDeleteDir(lib.id)"><Close /></button>
        </div>
        <div class="AddDiv" @click="onOpenAddDialog"><Plus /></div>
        <KLibDialog v-model="libAddShow" :path="libAddDirPath" :num="libAddNum" :total="libAddTotal" @confirm="onConfirmDir" />
      </div>
    </KSetting>
  </div>
</template>

<script setup lang="ts">
import Close from '@renderer/assets/icons/close.svg?component'
import Plus from '@renderer/assets/icons/plus.svg?component'
import { vTooltip } from '@renderer/directives/Tooltip'
import { getLibraryManager } from '@renderer/store'
import { basename } from '@renderer/utils/tools'
import type { IpcRendererEvent } from 'electron'

const libManager = getLibraryManager()
const { curLibs } = storeToRefs(libManager)
const libAddShow = ref(false)
const libAddNum = ref(0)
const libAddTotal = ref(10)
let libAddDirName = ''
let libAddDirPath = ''

onMounted(() => {
  window.api.db.onTransCreateCommonLib(onLibProgress)
})
onUnmounted(() => {
  window.api.db.offTransCreateCommonLib(onLibProgress)
})

// 曲库导入进度
function onLibProgress(_: IpcRendererEvent, inserted: number, total: number) {
  libAddNum.value = inserted
  libAddTotal.value = total
}
// 打开添加音乐目录对话框
async function onOpenAddDialog() {
  const path = await window.api.win.openDirectoryWindow()
  if (!path) return
  libAddDirName = basename(path)
  libAddDirPath = path
  libAddNum.value = 0
  libAddShow.value = true
}
// 添加曲库
async function onConfirmDir(mode: LibMode) {
  libManager.createLib(libAddDirName, libAddDirPath, mode)
}
// 删除曲库
function onDeleteDir(libID: number) {
  libManager.deleteLib(libID)
}
</script>

<style scoped lang="scss">
$title-font: 34px;
$icon-size: 20px;
.PSetting {
  padding: 0 10px;
  display: flex;
  flex-direction: column;
  row-gap: 13px;
  .PTitle {
    line-height: 45px;
    font-size: $title-font;
    font-weight: 300;
    user-select: none;
  }
  .Library {
    $item-height: 40px;
    $item-padding: 10px;
    // 音乐目录
    >div {
      height: $item-height;
      padding-left: $item-padding;
      background-color: #f2f2f2;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      &:hover {
        background-color: #d9d9d9;
        button { background-color: #d9d9d9; }
      }
      // 添加按钮
      &.AddDiv {
        position: relative;
        justify-content: flex-start;
        &:not(:first-child):before {
          content: '';
          position: absolute;
          left: $item-padding;
          top: 0;
          height: 1px;
          width: calc(100% - 2 * $item-padding);
          background-color: #d6d6d6;
        }
        &:active {
          background-color: #aeaeae;
        }
        >svg {
          height: $icon-size;
          width: $icon-size;
        }
      }
      // 目录信息
      &>span {
        margin-right: 10px;
        white-space: nowrap;
        // 第一项文本左对齐
        &:first-child {
          margin-right: auto;
          padding-right: 10px;
        }
        // 前两项文本溢出显示省略号
        &:nth-child(-n+3) {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        // 第三项及以后文本禁止选中
        &:nth-child(n+3) {
          flex-shrink: 0;
          user-select: none;
        }
        // 第四项文本右对齐
        &:nth-child(4) { width: 40px; }
        // 第二项和第四项字体颜色，若添加第六项，需修改
        &:nth-child(even) {
          font-size: 14px;
          color: #797a7a;
        }
      }
      // 删除按钮
      &>button {
        width: $item-height;
        padding: 0;
        border: none;
        align-self: stretch;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #c4c4c4;
        }
        &:active {
          background-color: #aeaeae;
        }
        >svg {
          height: $icon-size;
          width: $icon-size;
        }
      }
    }
  }
}
</style>
