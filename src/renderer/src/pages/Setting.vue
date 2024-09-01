<template>
  <div class="PSetting">
    <p class="PTitle">设置</p>
    <KSettingItem title="音乐目录">
      <div class="Library">
        <div v-for="item in libs.arr" :key="item.id">
          <span>{{ item.name }}</span>
          <span>{{ item.path }}</span>
          <span>模式</span>
          <el-select v-model="item.mode" popper-class="k-popper" @change="onChangeMode(item)">
            <el-option label="普通" value="normal" />
            <el-option label="ASMR" value="asmr" />
          </el-select>
          <button @click="onDeleteDir(item.id)"><el-icon><Close /></el-icon></button>
        </div>
        <div class="AddDiv" @click="onOpenAddDialog">
          <el-icon><Plus /></el-icon>
        </div>
        <el-dialog v-model="libAddDialog" :close-on-click-modal="false"
          :close-on-press-escape="false" class="k-lib-dialog">
          <template #header>
            <div v-if="libAddSelect">
              <el-icon><Refresh /></el-icon>
              <span>正在添加音乐</span>
              <el-progress :percentage="libAddPercent" />
            </div>
            <div v-else>
              <el-icon><Check /></el-icon>
              <span>当前目录</span>
              <span>{{ libAddDirPath }}</span><br>
              <span>选择模式</span>
              <el-select v-model="libAddMode" popper-class="k-popper">
                <el-option label="普通" value="normal" />
                <el-option label="ASMR" value="asmr" />
              </el-select>
              <button @click="onAddDir">确定</button>
            </div>
          </template>
        </el-dialog>
      </div>
    </KSettingItem>
  </div>
</template>

<script setup lang="ts">
import db from '@renderer/utils/db'
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
$Ptitle-size: 34px;
.PSetting {
  width: calc(100% - 300px);
  padding-top: 16px;
  display: flex;
  flex-direction: column;
  row-gap: 25px;
  .PTitle {
    font-size: $Ptitle-size;
    font-weight: 300;
    line-height: $Ptitle-size;
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
        &:first-child {
          margin-right: auto;
          padding-right: 10px;
        }
        &:nth-child(2) {
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #797a7a;
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
        .el-icon {
          $icon-size: 20px;
          height: $icon-size;
          width: $icon-size;
          svg {
            height: $icon-size;
            width: $icon-size;
          }
        }
      }
    }
  }
}
</style>
