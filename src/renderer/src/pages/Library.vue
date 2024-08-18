<template>
  <div class="PLibrary">
    <div class="ToolBar">
      <span>当前目录</span>
      <el-dropdown type="primary" split-button placement="bottom-end" popper-class="k-popper" size="large">
        {{ curLib?.name }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in Libs.arr" :key="item.id" @click="curLib = item">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="ListBar">

    </div>
  </div>
</template>

<script setup lang="ts">
import db from '@renderer/utils/indexedDB'

const Libs = reactive<{ arr: ILibrary[] }>({ arr: [] })
const curLib = ref<ILibrary | null>(null)

onMounted(async () => {
  Libs.arr = await db.getAllDir()
  curLib.value = Libs.arr[0]
})
</script>

<style scoped lang="scss">
.PLibrary {
  box-sizing: border-box;
  height: 100%;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  .ToolBar {
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
  .ListBar {
    flex: 1;
  }
}
</style>
