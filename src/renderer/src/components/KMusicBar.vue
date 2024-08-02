<template>
  <div class="controlDiv">
    <div class="sliderRow">
      <el-text>{{ formatTime(showTime) }}</el-text>
      <KSlider ref="timeSlider" :min="0" :max="player.totalTime" :cur="curTime" :disable="player.playerState === 'unload'"
        :color="player.mainColor" :tooltip="player.playerState !== 'unload'" :tooltip-format="(v: number) => formatTime(v, 'mm:ss')"
        @update-cur="(time) => { showTime = time }" @drag-cur="(time) => { player.currentTime = time }">
      </KSlider>
      <el-text>{{ formatTime(player.totalTime) }}</el-text>
    </div>
    <div class="buttonRow">
      <div class="detailBar">
        <el-button type="primary" size="default" @click="btnToggleDetail" class="musicDetailBut">
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
        <button>
          <svg>
            <path d="m10,9 l0,17"/>
            <path d="m25,10 l0,15 l-10,-7.5 z"/>
          </svg>
        </button>
        <button @click="btnFastBackward">
          <svg>
            <path d="m7.5,17.5 a 10 10 0 1 0 10,-10"/>
            <path d="m17.5,4.5 l0,6 l-5,-3 z" fill="white"/>
            <text x="50%" y="60%">10</text>
          </svg>
        </button>
        <button class="playButton" @click="btnTogglePlay">
          <svg>
            <path v-show="player.playerState === 'play'" d="m19,12 l0,22 m8,0 l0,-22"/>
            <path v-show="player.playerState !== 'play'" d="m17,13.5 l0,20 l15,-10 z"/>
          </svg>
        </button>
        <button @click="btnFastForward">
          <svg>
            <path d="m27.5,17.5 a 10 10 0 1 1 -10,-10"/>
            <path d="m17.5,4.5 l0,6 l5,-3 z" fill="white"/>
            <text x="50%" y="60%">10</text>
          </svg>
        </button>
        <button>
          <svg>
            <path d="m10,10 l0,15 l10,-7.5 z"/>
            <path d="m25,9 l0,17"/>
          </svg>
        </button>
      </div>
      <div class="toolBar">
        <button>
          <svg>
            <path d="m7,14.5 l0,6 l3,0 l4,4 l0,-14 l-4,4 l-3,0 z"/>
            <path d="m18,14 a 5 5 0 0 1 0,7" :visibility="curVolume == 0 ? 'hidden' : 'visible'"/>
            <path d="m21,11.5 a 9 9 0 0 1 0,12" :visibility="curVolume < 0.33 ? 'hidden' : 'visible'"/>
            <path d="m23.5,8.5 a 13 13 0 0 1 0,18" :visibility="curVolume < 0.66 ? 'hidden' : 'visible'"/>
            <path d="m18,14 l7,7" :visibility="curVolume == 0 ? 'visible' : 'hidden'"/>
            <path d="m18,21 l7,-7" :visibility="curVolume == 0 ? 'visible' : 'hidden'"/>
          </svg>
        </button>
        <KSlider :min="0" :max="100" :cur="100" :color="player.mainColor" :tooltip="true" :tooltip-format="(v: number) => Math.floor(v)"
        @update-cur="(volume) => { player.audio.volume = curVolume = volume * 0.01 }">
        </KSlider>
        <button @click="btnOpenFile">
          <svg>
            <path d="m8.5,10 l0,4 l3,-2 z" stroke-width="1px" fill="white"/>
            <path d="m14,12 l13,0" stroke-width="1px"/>
            <path d="m8,17.5 l19,0" stroke-width="1px"/>
            <path d="m8,23 l19,0" stroke-width="1px"/>
          </svg>
        </button>
        <button @click="btnUnloadFile">
          <svg>
            <circle cx="32%" cy="50%" r="0.5"/>
            <circle cx="50%" cy="50%" r="0.5"/>
            <circle cx="68%" cy="50%" r="0.5"/>
          </svg>
        </button>
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
const curTime = ref(0)
const showTime = ref(0)
const curVolume = ref(100)
const timeSlider = ref<InstanceType<typeof KSlider> | null>(null)

onMounted(() => {
  emitter.on(events.musicCanPlay, () => { store.musicPicURL = player.value.pictureURL as string})
  emitter.on(events.musicUpdateCur, (time) => { store.musicCurTime = curTime.value = time as number })
  emitter.on(events.musicReset, () => { curTime.value = 0; store.musicPicURL = ''; timeSlider.value?.reset() })
})

// 按钮功能
function btnToggleDetail() {
  store.toggleDetail()
}
function btnTogglePlay() {
  if (player.value.playerState === 'play') {
    player.value.pause()
  } else if (player.value.playerState === 'pause' || player.value.playerState === 'stop') {
    player.value.play()
  }
}
function btnFastForward() {
  player.value.currentTime += 10
}
function btnFastBackward() {
  player.value.currentTime -= 10
}
function btnUnloadFile() {
  player.value.unload()
}
async function btnOpenFile() {
  const filePath = await ipc.callMain('openFileWindow') as string | null
  if (filePath) {
    player.value.load(filePath)
    const res = await ipc.callMain('loadLyric', filePath) as { lyrics?: ILyric[], success: boolean }
    store.musicLyrics = res.success ? res.lyrics as ILyric[] : []
  }
}
</script>

<style scoped lang="scss">
@mixin svgButton($size: 35px) {
  height: $size;
  width: $size;
  padding: 0;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  &:hover {
    background-color: #00000030;
  }
  &:active {
    background-color: #00000050;
  }
  svg {
    height: 100%;
    width: 100%;
    stroke: white;
    stroke-width: 1.5px;
    stroke-linejoin: bevel;
    fill: transparent;
    text {
      text-anchor: middle;
      font-size: 10px;
      font-weight: 100;
      font-family: 'Segoe UI';
      stroke-width: 0.5px;
      letter-spacing: 0.5px;
    }
  }
}

.controlDiv {
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
      visibility: v-bind('player.playerState === "unload" ? "hidden" : "visible" ');
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
      flex: 1;
      max-width: 31.25%;
      :deep(.musicDetailBut) {
        justify-self: left;
        display: v-bind('player.playerState === "unload" ? "none" : "inline-flex" ');
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
      flex: 1.2;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      &>* {
        margin: 0 8px 0 8px;
      }
      button {
        @include svgButton(35px);
      }
      .playButton {
        @include svgButton(50px);
        border: 2px solid #ffffff40;
        &:active {
          background-color: transparent;
          border: 2px solid #ffffff;
        }
      }
    }
    .toolBar {
      flex: 1;
      margin: 0;
      display: flex;
      align-items: center;
      &>* {
        margin-right: 8px;
        &:first-child {
          margin-left: 50px;
        }
      }
      button {
        @include svgButton(35px);
      }
    }
  }
}
</style>
