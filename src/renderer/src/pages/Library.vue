<template>
  <div class="PLibrary">
    <div class="ToolBar">
      <span>当前目录</span>
      <el-dropdown type="primary" split-button placement="bottom-end" popper-class="k-popper" size="large">
        {{ libCur?.name }}
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in libs.arr" :key="item.id" @click="libCur = item">
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="ContentBar">
      <div class="ListBar">
        <div class="BtnBar"></div>
        <div class="List">
          <div class="Item" v-for="item in musics" :key="item.path" @click="(e) => onItemClick(e.currentTarget, item)">
            <span v-tooltip="item.name">{{ item.name }}</span>
            <span v-tooltip="item.artist">{{ item.artist }}</span>
            <span>{{ formatTime(item.duration, 'mm:ss') }}</span>
          </div>
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
const libs = reactive<{ arr: ILibrary[] }>({ arr: [] })
const libCur = ref<ILibrary | null>(null)
const musics = shallowRef<ILibMusic[]>([])
let musicSelected: any = null
onMounted(async () => {
  libs.arr = await db.getLibraries()
  libCur.value = libs.arr[0]
})
watch(libCur, async (val) => {
  if (!val) return
  const stime = performance.now()
  musics.value = await db.getMusics(val.name)
  console.log('获取音乐列表耗时', performance.now() - stime)
})
function onItemClick(curTarget: any, item: ILibMusic) {
  if (musicSelected) musicSelected.classList.remove('Select')
  curTarget.classList.add('Select')
  musicSelected = curTarget
  player.value.load(item.path)
}
</script>

<style scoped lang="scss">
.PLibrary {
  height: 100%;
  box-sizing: border-box;
  padding-top: 12px;
  .ToolBar {
    height: 45px;
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
    height: calc(100% - 45px);
    display: flex;
    .ListBar {
      width: 100%;
      height: 100%;
      .BtnBar {
        height: 30px;
        border-bottom: 1px solid #e5e5e5;
      }
      .List {
        height: calc(100% - 31px);
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
          &.Select {
            background-color: #0078d7 !important;
            color: white;
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
          &:focus {
            background-color: #0078d7;
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
    }
    .DetailBar {
      flex: 1;
    }
  }
}
</style>
