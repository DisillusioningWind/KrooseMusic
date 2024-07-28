<template>
  <div class="musicDiv">
    <div class="sliderRow">
      <el-text>{{ formatTime(showTime) }}</el-text>
      <KSlider ref="timeSlider" :min="0" :max="player.totalTime" :cur="curTime" :disable="player.audioState === 'unload'"
        :color="player.mainColor" :tooltip="true" :tooltip-format="(v: number) => formatTime(v, 'mm:ss')"
        @update-cur="(time) => { showTime = time }" @drag-cur="(time) => { player.currentTime = time }">
      </KSlider>
      <el-text>{{ formatTime(player.totalTime) }}</el-text>
    </div>
    <div class="buttonRow">
      <div class="detailBar">
        <el-button type="primary" size="default" @click="butToggleDetail" class="musicDetailBut">
          <el-image class="musicDetailButImg" :src="player.pictureURL??''" fit="cover">
            <template #error>
              <div class="image-failed">
                <el-icon ><Picture /></el-icon>
              </div>
            </template>
          </el-image>
          <div class="musicDetailButTextDiv">
            <el-text class="topText">{{ player.title }}</el-text>
            <el-text class="botText">{{ player.artist }}</el-text>
          </div>
        </el-button>
      </div>
      <div class="controlBar">
        <el-button type="primary" size="default" @click="butTogglePlay" class="controlBar">播放</el-button>
        <el-button type="primary" size="default" @click="butOpenFile" class="toolBar">打开文件</el-button>
        <el-button type="primary" size="default" @click="butUnloadFile" class="toolBar">卸载文件</el-button>
      </div>
      <div class="toolBar">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicPlayer } from '@renderer/classes/MusicPlayer'
import { useStore } from '@renderer/store'
import { emitter, events } from '@renderer/utils/emitter'
import { formatTime } from '@renderer/utils/tools'
import KSlider from './KSlider.vue'

const ipc = window.ipc
const store = useStore()
const player = useMusicPlayer()
let curTime = ref(0)
let showTime = ref(0)
const timeSlider = ref<InstanceType<typeof KSlider> | null>(null)

onMounted(() => {
  emitter.on(events.musicCanPlay, () => { store.detailPicUrl = player.value.pictureURL as string})
  emitter.on(events.musicUpdateCur, (time) => { curTime.value = time as number })
  emitter.on(events.musicReset, () => { curTime.value = 0; store.detailPicUrl = ''; timeSlider.value?.reset() })
})

// 按钮功能
function butToggleDetail() {
  store.toggleDetail()
}
function butTogglePlay() {
  if (player.value.audioState === 'play') {
    player.value.pause()
  } else if (player.value.audioState === 'pause' || player.value.audioState === 'stop') {
    player.value.play()
  }
}
function butUnloadFile() {
  player.value.unload()
}
async function butOpenFile() {
  const filePath = await ipc.callMain('openFileWindow') as string | null
  if (filePath) {
    player.value.load(filePath)
  }
}
</script>

<style scoped lang="scss">
.musicDiv {
  height: 100%;
  background-color: v-bind('player.mainColor');
  .sliderRow {
    margin: 0 12px;
    height: 32px;
    display: flex;
    align-items: center;
    .el-text {
      color: white;
      font-size: 12px;
      visibility: v-bind('player.audioState === "unload" ? "hidden" : "visible" ');
      &:first-child {
        margin-right: 22px;
      }
      &:last-child {
        margin-left: 22px;
      }
    }
  }
  .buttonRow {
    margin: 0;
    height: 90px;
    display: flex;
    justify-items: center;
    align-items: center;
    .detailBar {
      flex: 31.25%;
      max-width: 31.25%;
      :deep(.musicDetailBut) {
        justify-self: left;
        display: v-bind('player.audioState === "unload" ? "none" : "inline-flex" ');
        height: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 0;
        background-color: transparent;
        &:hover {
          background-color: #00000030;
        }
        &:active {
          background-color: #00000050;
        }
        &>span {
          display: flex;
          justify-content: left;
          margin: 0 10px 0 0;
          max-width: calc(100% - 10px);
          overflow: hidden;
          .musicDetailButImg {
            width: 90px;
            height: 90px;
            .image-failed {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 100%;
              height: 100%;
              background-color: #f2f2f2;
              color: #616161;
              .el-icon {
                font-size: 30px;
                padding: 0;
              }
            }
          }
          .musicDetailButTextDiv {
            height: 100%;
            width: calc(100% - 100px);
            margin: 0 0 0 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .topText {
              align-self: flex-start;
              font-size: 17.5px;
              font-weight: 100;
              color: white;
            }
            .botText {
              align-self: flex-start;
              font-size: 15px;
              font-weight: bold;
              color: white;
              margin-top: 5px;
            }
          }
        }
      }
    }
    .controlBar {
      flex: 37.5%;
      margin: 0;
      display: flex;
    }
    .toolBar {
      flex: 31.25%;
      margin: 0;
    }
  }
}
</style>
