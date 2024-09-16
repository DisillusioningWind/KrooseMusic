<template>
  <div class="PSetting">
    <p class="PTitle">设置</p>
    <KSettingItem title="音乐目录">
      <div class="Library">
        <div v-for="item in libs.arr" :key="item.id">
          <span v-tooltip.immediate.overflow="item.name">{{ item.name }}</span>
          <span v-tooltip.immediate.overflow="item.path">{{ item.path }}</span>
          <span>模式</span>
          <el-select v-model="item.mode" popper-class="k-popper" @change="onChangeMode(item)">
            <el-option label="普通" value="normal" />
            <el-option label="ASMR" value="asmr" />
          </el-select>
          <button @click="onDeleteDir(item.id)"><Close /></button>
        </div>
        <div class="AddDiv" @click="onOpenAddDialog"><Plus /></div>
        <el-dialog v-model="libAddDialog" :close-on-click-modal="false" :close-on-press-escape="false" class="k-lib-dialog">
          <template #header>
            <div v-if="libAddSelect" class="select">
              <el-icon><Refresh /></el-icon>
              <span>正在添加音乐</span>
              <el-progress :percentage="libAddPercent" />
            </div>
            <div v-else class="no-select">
              <div>
                <div>
                  <el-icon><Dir /></el-icon>
                  <span>当前目录</span>
                  <span>{{ libAddDirPath }}</span><br>
                </div>
                <div>
                  <span>选择模式</span>
                  <el-select v-model="libAddMode" size="small" popper-class="k-popper">
                    <el-option label="普通" value="normal" />
                    <el-option label="ASMR" value="asmr" />
                  </el-select>
                </div>
              </div>
              <button @click="onAddDir">
                <el-icon><Check /></el-icon>
              </button>
            </div>
          </template>
        </el-dialog>
      </div>
    </KSettingItem>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
import Close from '@renderer/assets/icons/close.svg?component'
import Plus from '@renderer/assets/icons/plus.svg?component'
import Refresh from '@renderer/assets/icons/refresh.svg?component'
import Dir from '@renderer/assets/icons/dir.svg?component'
import Check from '@renderer/assets/icons/check.svg?component'
import { useStore } from '@renderer/store'
const store = useStore()
const { db } = store
const libs = reactive<{arr: ILibrary[]}>({ arr: [] })
const libAddDialog = ref(false)
const libAddSelect = ref(false)
const libAddMode = ref<LibMode>('normal')
const libAddNum = ref(0)
const libAddTotal = ref(10)
const libAddPercent = computed(() => Math.round(libAddNum.value / libAddTotal.value * 100))
let libAddDirName = ''
let libAddDirPath = ''
onMounted(async () => {
  libs.arr = await db.getLibraries()
  window.ipc.on('musicLength', (_e, length) => libAddTotal.value = length)
  window.ipc.on('musicData', onGetData)
})
onUnmounted(() => {
  window.ipc.removeAllListeners('musicLength')
  window.ipc.removeAllListeners('musicData')
})
async function onOpenAddDialog() {
  const path = await window.ipc.invoke('openDirectoryWindow') as string | null
  if (!path) return
  libAddSelect.value = false
  libAddDialog.value = true
  libAddDirName = window.path.basename(path)
  libAddDirPath = path
  libAddNum.value = 0
}
async function onAddDir() {
  const id = await db.addLibrary(libAddDirName, libAddDirPath, libAddMode.value)
  libs.arr.push({ id, name: libAddDirName, path: libAddDirPath, mode: libAddMode.value })
  console.log('音乐目录添加成功')
  libAddSelect.value = true
  if (libAddMode.value === 'normal') window.ipc.invoke('getDirMusics', libAddDirPath)
  else if(libAddMode.value === 'asmr') window.ipc.invoke('getDirAlbums', libAddDirPath)
}
async function onDeleteDir(id: number) {
  db.deleteLibrary(id)
  libs.arr = libs.arr.filter(item => item.id !== id)
  console.log('音乐目录删除成功')
}
async function onChangeMode(item: ILibrary) {
  db.updateLibrary(item.id, item.mode)
}
async function onGetData(_e, music: ILibItem) {
  await db.addItem(libAddDirName, music)
  libAddNum.value++
  if (libAddNum.value === libAddTotal.value) {
    libAddDialog.value = false
    console.log('音乐添加成功')
  }
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
    >div {
      height: $item-height;
      padding-left: $item-padding;
      background-color: #f2f2f2;
      display: flex;
      justify-content: flex-end;
      align-items: center;
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
      &:hover {
        background-color: #d9d9d9;
        button {
          background-color: #d9d9d9;
        }
      }
      &>span {
        margin-right: 10px;
        white-space: nowrap;
        &:not(:last-of-type) {
          overflow: hidden;
          text-overflow: ellipsis;
        }
        &:first-child {
          margin-right: auto;
          padding-right: 10px;
        }
        &:nth-child(2) {
          font-size: 14px;
          color: #797a7a;
        }
        &:last-of-type {
          user-select: none;
        }
      }
      &:deep(.el-select) {
        width: 100px;
        flex-shrink: 0;
        .el-select__wrapper {
          box-shadow: none;
          border-radius: 0;
        }
      }
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
