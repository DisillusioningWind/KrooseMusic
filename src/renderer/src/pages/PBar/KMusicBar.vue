<template>
  <div class="KMusicBar" :style="{ backgroundColor: mscColor + 'd0' }">
    <div class="sliderRow">
      <span class="time" :class="{ hide: mscUnload }">{{ formatTime(mscShowTime) }}</span>
      <KSlider :max="mscDur" :cur="mscTime" :disable="mscUnload" :format="v=>formatTime(v,'mm:ss')" @update="time=>{ mscShowTime=time }" @drag="sliderDragTime" />
      <span class="time" :class="{ hide: mscUnload }">{{ formatTime(mscDur) }}</span>
    </div>
    <div class="buttonRow">
      <div class="detailBar">
        <KDetailBtn v-show="!mscUnload" :title="mscTitle" :artist="mscArtist" :picURL="mscPicURL" :showPic="!showDetail" @click="btnChangeDetail" />
      </div>
      <div class="controlBar">
        <button class="svgBtn" :class="{ unload: mscUnload }" v-tooltip="(!mscUnload)?'上一首':''" @click="btnLastMusic">
          <svg>
            <path d="m10,9 l0,17"/>
            <path d="m25,10 l0,15 l-10,-7.5 z"/>
          </svg>
        </button>
        <button class="svgBtn" :class="{ unload: mscUnload }" v-tooltip="(!mscUnload)?'向前10秒':''" @click="btnFastBackward">
          <svg>
            <path d="m7.5,17.5 a 10 10 0 1 0 10,-10"/>
            <path class="navigation" d="m17.5,4.5 l0,6 l-5,-3 z"/>
            <text x="50%" y="60%">10</text>
          </svg>
        </button>
        <button class="svgBtn playBtn" :class="{ unload: mscUnload }" v-tooltip="(!mscUnload)?(mscState==='play'?'暂停':'播放'):''" @click="btnChangeState">
          <svg>
            <path v-show="mscState==='play'" d="m19,12 l0,22 m8,0 l0,-22"/>
            <path v-show="mscState!=='play'" d="m17,13.5 l0,20 l15,-10 z"/>
          </svg>
        </button>
        <button class="svgBtn" :class="{ unload: mscUnload }" v-tooltip="(!mscUnload)?'向后10秒':''" @click="btnFastForward">
          <svg>
            <path d="m27.5,17.5 a 10 10 0 1 1 -10,-10"/>
            <path class="navigation" d="m17.5,4.5 l0,6 l5,-3 z"/>
            <text x="50%" y="60%">10</text>
          </svg>
        </button>
        <button class="svgBtn" :class="{ unload: mscUnload }" v-tooltip="(!mscUnload)?'下一首':''" @click="btnNextMusic">
          <svg>
            <path d="m10,10 l0,15 l10,-7.5 z"/>
            <path d="m25,9 l0,17"/>
          </svg>
        </button>
      </div>
      <div class="toolBar">
        <KLoopBtn class="svgBtn" v-model="loopMode" />
        <button class="svgBtn" v-tooltip="'开启静音'" @click.stop="btnChangeMute">
          <svg>
            <path d="m7,14.5 l0,6 l3,0 l4,4 l0,-14 l-4,4 l-3,0 z"/>
            <path d="m18,14 a 5 5 0 0 1 0,7"       :visibility="(mscVol == 0 || mscMute)?'hidden':'visible'" />
            <path d="m21,11.5 a 9 9 0 0 1 0,12"    :visibility="(mscVol < 33.3 || mscMute)?'hidden':'visible'" />
            <path d="m23.5,8.5 a 13 13 0 0 1 0,18" :visibility="(mscVol < 66.6 || mscMute)?'hidden':'visible'" />
            <!-- 静音 -->
            <path d="m18,14 l7,7"  :visibility="(mscVol == 0 || mscMute)?'visible':'hidden'" />
            <path d="m18,21 l7,-7" :visibility="(mscVol == 0 || mscMute)?'visible':'hidden'" />
          </svg>
        </button>
        <KSlider :cur="mscVol" :format="v => Math.floor(v).toString()" @update="sliderUpdateVol" />
        <button class="svgBtn" v-tooltip="'正在播放'" @click.stop="btnChangeDrawer">
          <svg>
            <path d="m8.5,10 l0,4 l3,-2 z" stroke-width="1px" fill="white"/>
            <path d="m14,12 l13,0" stroke-width="1px"/>
            <path d="m8,17.5 l19,0" stroke-width="1px"/>
            <path d="m8,23 l19,0" stroke-width="1px"/>
          </svg>
        </button>
        <button class="svgBtn" v-tooltip="'更多'" v-menu="mscMenu">
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
import { useLibStore, useUIStore, useAudioStore, useInfoStore } from '@renderer/store'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vMenu } from '@renderer/directives/Menu'
import { formatTime } from '@renderer/utils/tools'
import bus from '@renderer/utils/emitter'
import svgOpenDir from '@renderer/assets/icons/dir.svg?component'
import svgOpenFile from '@renderer/assets/icons/plus.svg?component'
import svgCloseFile from '@renderer/assets/icons/close.svg?component'
// 数据
const { loopMode } = storeToRefs(useLibStore())
const { showDetail } = storeToRefs(useUIStore())
const { mscState, mscVol, mscDur, mscTime, mscMute } = storeToRefs(useAudioStore())
const { mscTitle, mscArtist, mscPicURL, mscColor } = storeToRefs(useInfoStore())
const mscUnload = computed(() => mscState.value === 'unload')// 音乐未加载状态
const mscShowTime = ref(0)// 滑动条显示进度，滑动时实际进度不改变，等松开时才改变，但是显示进度实时更新
const mscMenu = [
  { label: '打开目录', icon: svgOpenDir, action: btnOpenDir},
  { label: '打开文件', icon: svgOpenFile, action: btnOpenFile },
  { label: '卸载文件', icon: svgCloseFile, action: btnUnloadFile }
]
// 滑动条控制
function sliderDragTime(time: number) { bus.emUpdateMsc(time) }
function sliderUpdateVol(vol: number) { bus.emChangeMscVol(vol) }
// UI控制
function btnChangeDetail() { bus.emChangeDetailState() }
function btnChangeDrawer() { bus.emChangeDrawerState() }
// 音乐控制
function btnChangeMute() { bus.emChangeMscMute() }
function btnChangeState() { if (!mscUnload.value) bus.emChangeMscState() }
function btnFastForward() { if (!mscUnload.value) bus.emUpdateMsc(10, true) }
function btnFastBackward() { if (!mscUnload.value) bus.emUpdateMsc(-10, true) }
function btnLastMusic() { if (!mscUnload.value) bus.emLoopMsc(false) }
function btnNextMusic() { if (!mscUnload.value) bus.emLoopMsc(true) }
// 文件操作
function btnUnloadFile() { bus.emUnloadMsc() }
async function btnOpenDir() { /** TODO */ }
async function btnOpenFile() {
  const path = await window.api.openFileWindow()
  if (!path) return
  bus.emLoadMsc(path)
}
</script>

<style scoped lang="scss">
$sli-hei: 32px;
$btn-hei: 90px;
@mixin k-svg-btn($size: 35px) {
  height: $size;
  width: $size;
  border: none;
  border-radius: 50%;
  background-color: transparent;
  &:hover { background-color: #00000030; }
  &:active { background-color: #00000050; }
  &.unload:hover { background-color: transparent; }
  &.unload:active { background-color: transparent; }
  &.unload>svg { stroke: #ffffff40; }
  >svg {
    height: 100%;
    width: 100%;
    stroke: white;
    stroke-width: 1.5px;
    stroke-linejoin: bevel;
    fill: transparent;
    >text {
      text-anchor: middle;
      font-size: 10px;
      font-weight: 100;
      font-family: 'Segoe UI';
      stroke-width: 0.5px;
      letter-spacing: 0.5px;
    }
  }
}

.KMusicBar {
  backdrop-filter: blur(30px);
  z-index: 1;
  >.sliderRow {
    height: $sli-hei;
    margin: 0 12px;
    display: flex;
    align-items: center;
    gap: 0 22px;
    // 进度条两侧时间显示
    >.time {
      color: white;
      font-size: 12px;
      &.hide { visibility: hidden; }
    }
  }
  >.buttonRow {
    height: $btn-hei;
    display: flex;
    align-items: center;
    >.detailBar {
      flex: 1;
      max-width: 31.25%;
    }
    >.toolBar {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      >.svgBtn {
        &:last-child { margin-right: 8px; }
        @include k-svg-btn(35px);
      }
    }
    >.controlBar {
      flex: 1.2;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0 16px;
      >.svgBtn {
        @include k-svg-btn(35px);
        // 快进快退键的箭头fill值单独设置
        .navigation { fill: white; }
        &.unload .navigation { fill: #ffffff40; }
      }
      >.playBtn {
        @include k-svg-btn(50px);
        border: 2px solid #ffffff40;
        &:active:not(.unload) {
          background-color: transparent;
          border-color: white;
        }
      }
    }
  }
}
</style>
