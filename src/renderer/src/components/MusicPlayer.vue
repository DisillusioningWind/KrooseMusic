<template>
  <div class="musicDiv">
    <el-row class="timeRow">
      <el-col :span="2" class="timeLeftText"><el-text>{{ toDateString(curTime) }}</el-text></el-col>
      <el-col :span="20" >
        <audio :v-show="false" ref="audio" @canplay="onCanPlay" @timeupdate="onTimeUpdate"></audio>
        <el-slider v-model="curTime" :max="tolTime" @change="audioChangeTime" @input="audioChangeInput"></el-slider>
      </el-col>
      <el-col :span="2" class="timeRightText"><el-text>{{ toDateString(tolTime) }}</el-text></el-col>
    </el-row>
    <div class="butRow">
      <div class="detailBar">
        <el-button type="primary" size="default" @click="" class="musicDetailBut">
          <el-image class="musicDetailButImg" :src="pictureURL" fit="cover"></el-image>
          <div class="musicDetailButTextDiv">
            <el-text class="topText">{{ musicTags?.title }}</el-text>
            <el-text class="botText">{{ musicTags?.artist }}</el-text>
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
import { openFileWindow, loadFile } from '@renderer/api/file'
import { loadMusicTagsFromBuffer, getMainColorFromBuffer } from '@renderer/api/music'

const audio = ref()
let tolTime = ref(100)
let curTime = ref(0)
let pictureURL = ref('')
let filePath: string
let musicTags = ref()
let audioState:'unload' | 'play' | 'pause' | 'stop' = 'unload'
let sliderState: 'drag' | 'slide' = 'slide'
let musicBackgroundColor = ref('#1a5d8e')

function audioPlay() {
  if (audioState === 'pause' || audioState === 'stop') {
    audio.value.play()
    audioState = 'play'
  }
}
function audioPause() {
  if (audioState === 'play') {
    audio.value.pause()
    audioState = 'pause'
  }
}
function audioStop() {
  if (audioState === 'play') {
    audio.value.pause()
    audio.value.currentTime = 0
    audioState = 'stop'
  }
}
function audioChangeInput() {
  if (sliderState === 'slide') {
    sliderState = 'drag'
  }
}
function audioChangeTime(time) {
  console.log('audio change', toDateString(time))
  audio.value.currentTime = time
  sliderState = 'slide'
}

function onCanPlay() {
  tolTime.value = audio.value.duration
  audioState = 'stop'
  audioPlay()
}
function onTimeUpdate() {
  if (sliderState === 'slide') {
    curTime.value = audio.value.currentTime
  }
}

function butTogglePlay() {
  if (audioState === 'play') {
    audioPause()
  } else if (audioState === 'pause' || audioState === 'stop') {
    audioPlay()
  }
}
async function butOpenFile() {
  filePath = await openFileWindow() as string
  if (filePath) {
    URL.revokeObjectURL(audio.value.src)
    URL.revokeObjectURL(pictureURL.value)
    const { buffer } = loadFile(filePath)
    musicTags.value = await loadMusicTagsFromBuffer(buffer)
    pictureURL.value = URL.createObjectURL(new Blob([musicTags.value.picture[0].data]))
    // musicBackgroundColor.value = getMainColorFromBuffer(musicTags.value.picture[0].data)
    getMainColorFromBuffer(musicTags.value.picture[0].data)
    audio.value.src = URL.createObjectURL(new Blob([buffer]))
  }
}

function toDateString(time: number) {
  const hour = Math.floor(time / 3600)
  const min = Math.floor((time % 3600) / 60)
  const sec = Math.floor(time % 60)

  const minStr = min < 10 ? `0${min}` : min
  const secStr = sec < 10 ? `0${sec}` : sec
  return `${hour}:${minStr}:${secStr}`
}
</script>

<style scoped lang="scss">
%timeText {
  display: flex;
  align-items: center;
}

.musicDiv {
  height: 100%;
  .timeRow {
    margin: 0 12px;
    height: 30px;
    .timeLeftText {
      @extend %timeText;
      justify-content: left;
    }
    .timeRightText {
      @extend %timeText;
      justify-content: right;
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
        height: 100%;
        max-width: 100%;
        margin: 0;
        padding: 0;
        border: none;
        border-radius: 0;
        background-color: v-bind('musicBackgroundColor');
        &>span {
          display: flex;
          justify-content: left;
          margin: 0 10px 0 0;
          max-width: calc(100% - 10px);
          overflow: hidden;
          .musicDetailButImg {
            width: 90px;
            height: 90px;
          }
          .musicDetailButTextDiv {
            height: 100%;
            max-width: calc(100% - 100px);
            margin: 0;
            padding: 0 0 0 10px;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
            .topText {
              justify-self: left;
              font-size: 17.5px;
              font-weight: lighter;
              color: white;
            }
            .botText {
              justify-self: left;
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
