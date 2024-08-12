<template>
  <div class="KMusicBar" v-ctx-menu="menu">
    <div class="sliderRow" v-no-ctx-menu>
      <el-text>{{ formatTime(showTime) }}</el-text>
      <KSlider :min="0" :max="player.totalTime" :cur="curTime" :disable="player.playerState === 'unload'" :tooltip="player.playerState !== 'unload'"
        :tooltip-format="(v: number) => formatTime(v, 'mm:ss')" @update-cur="(time) => { showTime = time }" @drag-cur="(time) => { player.currentTime = time }">
      </KSlider>
      <el-text>{{ formatTime(player.totalTime) }}</el-text>
    </div>
    <div class="buttonRow">
      <div class="detailBar">
        <KDetailBtn :title="player.title" :artist="player.artist" :picURL="player.pictureURL || ''"
          :showPic="!store.showDetail" v-show="player.playerState !== 'unload'" @click="btnToggleDetail">
        </KDetailBtn>
      </div>
      <div class="controlBar" v-no-ctx-menu>
        <button v-tooltip="player.playerState !== 'unload' ? '上一首' : ''">
          <svg>
            <path d="m10,9 l0,17"/>
            <path d="m25,10 l0,15 l-10,-7.5 z"/>
          </svg>
        </button>
        <button v-tooltip="player.playerState !== 'unload' ? '向前10秒' : ''" @click="btnFastBackward">
          <svg>
            <path d="m7.5,17.5 a 10 10 0 1 0 10,-10"/>
            <path class="forwardPath" d="m17.5,4.5 l0,6 l-5,-3 z"/>
            <text x="50%" y="60%">10</text>
          </svg>
        </button>
        <button class="playButton" v-tooltip="player.playerState !== 'unload' ? (player.playerState === 'play' ? '暂停' : '播放') : ''" @click="btnTogglePlay">
          <svg>
            <path v-show="player.playerState === 'play'" d="m19,12 l0,22 m8,0 l0,-22"/>
            <path v-show="player.playerState !== 'play'" d="m17,13.5 l0,20 l15,-10 z"/>
          </svg>
        </button>
        <button v-tooltip="player.playerState !== 'unload' ? '向后10秒' : ''" @click="btnFastForward">
          <svg>
            <path d="m27.5,17.5 a 10 10 0 1 1 -10,-10"/>
            <path class="forwardPath" d="m17.5,4.5 l0,6 l5,-3 z"/>
            <text x="50%" y="60%">10</text>
          </svg>
        </button>
        <button v-tooltip="player.playerState !== 'unload' ? '下一首' : ''">
          <svg>
            <path d="m10,10 l0,15 l10,-7.5 z"/>
            <path d="m25,9 l0,17"/>
          </svg>
        </button>
      </div>
      <div class="toolBar">
        <button v-no-ctx-menu v-tooltip="'开启静音'">
          <svg>
            <path d="m7,14.5 l0,6 l3,0 l4,4 l0,-14 l-4,4 l-3,0 z"/>
            <path d="m18,14 a 5 5 0 0 1 0,7" :visibility="curVolume == 0 ? 'hidden' : 'visible'"/>
            <path d="m21,11.5 a 9 9 0 0 1 0,12" :visibility="curVolume < 0.33 ? 'hidden' : 'visible'"/>
            <path d="m23.5,8.5 a 13 13 0 0 1 0,18" :visibility="curVolume < 0.66 ? 'hidden' : 'visible'"/>
            <path d="m18,14 l7,7" :visibility="curVolume == 0 ? 'visible' : 'hidden'"/>
            <path d="m18,21 l7,-7" :visibility="curVolume == 0 ? 'visible' : 'hidden'"/>
          </svg>
        </button>
        <KSlider v-no-ctx-menu :min="0" :max="100" :cur="curVolume" :tooltip="true" :tooltip-format="(v: number) => Math.floor(v)"
          @update-cur="(volume) => { player.audio.volume = curVolume = volume * 0.01 }">
        </KSlider>
        <button v-no-ctx-menu v-tooltip="'播放列表'">
          <svg>
            <path d="m8.5,10 l0,4 l3,-2 z" stroke-width="1px" fill="white"/>
            <path d="m14,12 l13,0" stroke-width="1px"/>
            <path d="m8,17.5 l19,0" stroke-width="1px"/>
            <path d="m8,23 l19,0" stroke-width="1px"/>
          </svg>
        </button>
        <button v-no-ctx-menu v-tooltip="'更多'" v-menu="menu">
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
import { bus } from '@renderer/utils/emitter'
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu, vMenu, vNoCtxMenu } from '@renderer/directives/Menu'
import svgOpenDir from '@renderer/assets/icons/openDir.svg?url'
import svgOpenFile from '@renderer/assets/icons/openFile.svg?url'
import svgCloseFile from '@renderer/assets/icons/closeFile.svg?url'
// 数据
const ipc = window.ipc
const store = useStore()
const player = useMusicPlayer()
const showTime = ref(0)
const curTime = ref(0)
const curVolume = ref(100)
const menu = [
  { label: '打开目录', icon: svgOpenDir, action: btnOpenDir},
  { label: '打开文件', icon: svgOpenFile, action: btnOpenFile },
  { label: '卸载文件', icon: svgCloseFile, action: btnUnloadFile }
]
let mainDirHandle: FileSystemDirectoryHandle | null = null
let uid = -1
// 事件绑定
onMounted(() => {
  bus.musicCanPlay(() => { store.musicPicURL = player.value.pictureURL as string })
  bus.musicUpdateCur((time) => { store.musicCurTime = curTime.value = time })
  bus.musicReset(onMusicReset)
  bus.menuSelect(onMenuSelect)
  uid = getCurrentInstance()?.uid || -1
})
// 事件处理
function onMusicReset() {
  curTime.value = 0
  store.musicPicURL = ''
  store.musicLyrics = []
  store.showDetail = false
}
function onMenuSelect(data: { uid: number, value: string }) {
  if (data.uid !== uid) return
  menu.find(item => item.label === data.value)?.action()
}
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
async function btnOpenDir() {
  // @ts-ignore
  const directoryHandle = await window.showDirectoryPicker() as FileSystemDirectoryHandle
  if (!directoryHandle) return
  const req = window.indexedDB.open('KrooseDB')
  req.onupgradeneeded = (ev) => {
    // @ts-ignore
    const db = ev.target.result as IDBDatabase
    const objStore = db.createObjectStore('Library', { autoIncrement: true })
    objStore.createIndex('name', 'name', { unique: false })
    objStore.transaction.oncomplete = () => {
      const res = db.transaction('Library', 'readwrite').objectStore('Library').add({ name: directoryHandle.name, dir: directoryHandle })
      const com = (success: boolean) => { console.log(success ? '音乐目录添加成功' : '音乐目录添加失败'); db.close() }
      res.onsuccess = () => com(true)
      res.onerror = () => com(false)
    }
  }
}
function btnOpenFile() {
  if (mainDirHandle) {
    openFile()
  } else {
    const req = window.indexedDB.open('KrooseDB')
    req.onerror = () => console.log('KrooseDB打开失败')
    req.onsuccess = () => {
      const db = req.result
      const res = db.transaction('Library').objectStore('Library').get(1)
      res.onsuccess = () => {
        mainDirHandle = res.result.dir
        openFile()
        db.close()
      }
    }
  }
}
async function openFile() {
  //申请权限
  if (!mainDirHandle) return
  // @ts-ignore
  const perRes = await mainDirHandle.queryPermission({ mode: 'read' })
  if (perRes !== 'granted') {
    // @ts-ignore
    console.log('申请权限:', await mainDirHandle.requestPermission({ mode: 'read' }))
  }
  //打开文件
  const filePath = await ipc.callMain('openFileWindow') as string | null
  if (!filePath) return
  const relPaths = filePath.slice(filePath.lastIndexOf(`\\${ mainDirHandle.name }\\`) + mainDirHandle.name.length + 2).split('\\')
  let dirHandle = mainDirHandle
  for (let i = 0; i < relPaths.length - 1; i++) {
    dirHandle = await dirHandle.getDirectoryHandle(relPaths[i])
  }
  player.value.load(await (await dirHandle.getFileHandle(relPaths.at(-1) as string)).getFile())
  const colorRes = ipc.callMain('getMainColorFromFile', filePath)
  const lyricRes = ipc.callMain('loadLyric', filePath)
  player.value.mainColor = await colorRes as string
  store.musicLyrics = await lyricRes as ILyric[]
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

.KMusicBar {
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
        &:hover {
          background-color: v-bind('player.playerState === "unload" ? "transparent" : "#00000030"');
        }
        &:active {
          background-color: v-bind('player.playerState === "unload" ? "transparent" : "#00000050"');
        }
        svg {
          stroke: v-bind('player.playerState === "unload" ? "#ffffff40" : "white"');
          .forwardPath {
            fill: v-bind('player.playerState === "unload" ? "#ffffff40" : "white"');
          }
        }
      }
      .playButton {
        @include svgButton(50px);
        &:hover {
          background-color: v-bind('player.playerState === "unload" ? "transparent" : "#00000030"');
        }
        &:active {
          background-color: v-bind('player.playerState === "unload" ? "transparent" : "#00000050"');
        }
        svg {
          stroke: v-bind('player.playerState === "unload" ? "#ffffff40" : "white"');
        }
        border: 2px solid #ffffff40;
        &:active {
          background-color: transparent;
          border-width: 2px;
          border-color: v-bind('player.playerState === "unload" ? "#ffffff40" : "white"');
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
