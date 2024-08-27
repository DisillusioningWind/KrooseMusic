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
        <div @click="onAddDir">
          <el-dialog v-model="libAddDialog" :close-on-click-modal="false"
            :close-on-press-escape="false" class="k-lib-dialog">
            <template #header>
              <el-icon><Refresh /></el-icon>
              <span>正在添加音乐</span>
              <el-progress :percentage="libPercent" />
            </template>
          </el-dialog>
          <el-icon><Plus /></el-icon>
        </div>
      </div>
    </KSettingItem>
  </div>
</template>

<script setup lang="ts">
import db from '@renderer/utils/db'
const libs = reactive<{arr: ILibrary[]}>({ arr: [] })
const libAddDialog = ref(false)
const libAddDir = ref('')
const libAddNum = ref(0)
const libAddTotal = ref(10)
const libPercent = computed(() => Math.round(libAddNum.value / libAddTotal.value * 100))
onMounted(async () => {
  libs.arr = await db.getLibraries()
  window.ipc.on('musicLength', (_e, length) => libAddTotal.value = length)
  window.ipc.on('musicData', onGetMusic)
})
async function onAddDir() {
  const path = await window.ipc.invoke('openDirectoryWindow') as string | null
  if (!path) return
  const name = window.path.basename(path)
  const id = await db.addLibrary(name, path)
  libs.arr.push({ id, name, path, mode: 'normal' })
  console.log('音乐目录添加成功')
  libAddDialog.value = true
  libAddDir.value = name
  libAddNum.value = 0
  window.ipc.invoke('getDirMusics', path)
}
async function onDeleteDir(id: number) {
  db.deleteLibrary(id)
  libs.arr = libs.arr.filter(item => item.id !== id)
  console.log('音乐目录删除成功')
}
async function onChangeMode(item: ILibrary) {
  db.updateLibrary(item.id, item.mode)
}
function onGetMusic(_e, music: ILibMusic) {
  db.addMusic(libAddDir.value, music)
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
      &:last-child {
        position: relative;
        justify-content: flex-start;
        &:not(:only-child):before {
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
