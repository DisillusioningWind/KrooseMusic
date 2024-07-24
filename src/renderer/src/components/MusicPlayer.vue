<template>
  <div class="musicDiv">
    <el-row class="timeRow">
      <el-col :span="2" class="timeLeftText"><el-text>{{ formatTime(showTime) }}</el-text></el-col>
      <el-col :span="20" class="timeSliderCol">
         <KSlider :min="0" :max="player.totalTime" :cur="curTime" :disable="player.audioState === 'unload'" :color="player.mainColor"></KSlider>
      </el-col>
      <el-col :span="2" class="timeRightText"><el-text>{{ formatTime(player.totalTime) }}</el-text></el-col>
    </el-row>
    <div class="butRow">
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
      <!-- <el-button type="primary" size="default" @click="">上一首</el-button> -->
      <el-button type="primary" size="default" @click="butTogglePlay" class="controlBar">播放</el-button>
      <!-- <el-button type="primary" size="default" @click="">下一首</el-button> -->
      <el-button type="primary" size="default" @click="butOpenFile" class="toolBar">打开文件</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMusicPlayer } from '@renderer/classes/MusicPlayer'
import { useStore } from '@renderer/store'
import { emitter, events } from '@renderer/utils/emitter'
import { formatTime } from '@renderer/utils/tools'

const ipc = window.ipc
const store = useStore()
const player = useMusicPlayer()
let curTime = ref(0)
let showTime = ref(0)

onMounted(() => {
  player.value.onTimeUpdate(sliderTickCur)
  player.value.onReset(sliderReset)
  emitter.on(events.sliderDragCur, (time) => { player.value.currentTime = time as number })
  emitter.on(events.sliderShowCur, (time) => { showTime.value = time as number })
})

// 进度条功能
function sliderTickCur() {
  if (player.value.audioState === 'play') {
    curTime.value = player.value.currentTime
  }
}
function sliderReset() {
  curTime.value = 0
  emitter.emit(events.sliderReset)
}
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
async function butOpenFile() {
  const filePath = await ipc.callMain('openFileWindow') as string | null
  if (filePath) {
    player.value.load(filePath)
  }
}
</script>

<style scoped lang="scss">
@mixin timeText {
  display: flex;
  align-items: center;
}

.musicDiv {
  height: 100%;
  background-color: v-bind('player.mainColor');
  .timeRow {
    margin: 0 12px;
    height: 32px;
    .timeLeftText {
      @include timeText;
      justify-content: left;
      .el-text {
        font-size: 12px;
        font-weight: 400;
        color: white;
      }
    }
    .timeRightText {
      @include timeText;
      justify-content: right;
      .el-text {
        font-size: 12px;
        font-weight: 400;
        color: white;
      }
    }
    .timeSliderCol {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }
  .butRow {
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
    }
    .toolBar {
      flex: 31.25%;
      margin: 0;
    }
  }
}
</style>
