import { defineStore } from 'pinia'
import { getMusicPath, setMusicPath } from '@renderer/utils/storage'
import bus from '@renderer/utils/emitter'
import KDBManager from '@renderer/services/db'
import KPlayer from '@renderer/services/player'

export const useStore = defineStore('main', () => {
  // 界面状态
  const navExpand = ref(false)
  const showDetail = ref(false)
  const showDrawer = ref(false)
  // 曲库数据
  const db = new KDBManager()
  const curLibs = shallowRef<ILibrary[]>([])
  const curItems = shallowRef<ILibItem[]>([])
  const curList = shallowRef<ILibItem[]>([])
  const curLib = ref<ILibrary>()
  const curItem = computed(() => curItems.value.find(item => item.path===(curLib.value?.mode==='normal'?musicPath.value:albumPath.value)))
  // 播放器数据
  const player = ref(new KPlayer())
  const playerState = computed(() => player.value.state)
  const musicDuration = computed(() => player.value.duration)
  const musicCurTime = ref(0)
  const curVol = ref(100)
  const albumPath = ref('')
  const musicPath = ref('')
  const musicTitle = ref('')
  const musicArtist = ref('')
  const musicPicURL = ref('')
  const musicColor = ref('#1a5d8e')
  const musicLyrics = shallowRef<ILyric[]>([])
  // 初始化事件
  player.value.initEvents()
  player.value.initHandlers()
  bus.onMusicInfoLoad(musicInfoLoad)
  bus.onMusicUnload(musicUnload)
  bus.onMusicEnd(musicEnd)
  bus.onMusicUpdateCur(musicUpdateCur)
  bus.onDbOpen(initCurLibs)
  initMusic()
  // 监视
  watch(curLib, async (curLib) => {
    if (!curLib) return
    const cnt = await db.getItemNums(curLib.name)
    const size = 500
    const res = [] as ILibItem[]
    for (let i = 0; i < cnt; i += size) { res.push(...await db.getItems(curLib.name, i, size)) }
    curItems.value = res
  })
  watch(curList, async (curList) => {
    await db.clearItems('curlist')
    await db.addItems('curlist', curList)
  })
  watch(curVol, (vol) => { player.value.volume = vol * 0.01 })
  // 事件处理
  async function initCurLibs() {
    curLibs.value = await db.getLibraries()
    if (curLibs.value.length > 0) curLib.value = curLibs.value[0]
  }
  function initMusic() {
    const path = getMusicPath()
    if (path.length > 0) player.value.load(path, false)
  }
  function musicInfoLoad() {
    musicPath.value = player.value.path
    musicTitle.value = player.value.title
    musicArtist.value = player.value.artist
    musicPicURL.value = player.value.picURL
    musicColor.value = player.value.mainColor
    musicLyrics.value = player.value.lyrics
    setMusicPath(musicPath.value)
  }
  function musicUnload() {
    musicCurTime.value = 0
    musicPath.value = ''
    musicTitle.value = ''
    musicArtist.value = ''
    musicPicURL.value = ''
    musicColor.value = '#1a5d8e'
    musicLyrics.value = []
    showDetail.value = false
    setMusicPath('')
  }
  function musicEnd() {
    const idx = curList.value.findIndex(item => item.path === musicPath.value)
    if (idx === -1) {
      // WARN: 未找到当前音乐
    } else if (idx === curList.value.length - 1) {
      // TODO: 循环模式
    } else {
      player.value.load(curList.value[idx + 1].path)
    }
  }
  function musicUpdateCur(cur: number) { musicCurTime.value = cur }
  // 方法
  function toggleDetail() { showDetail.value = !showDetail.value }
  function toggleDrawer() { showDrawer.value = !showDrawer.value }
  function loadMusic(path: string, auto: boolean = true) { player.value.load(path, auto) }
  function unloadMusic() { player.value.unload() }
  function toggleMusicPlay() {
    if (player.value.state === 'play') player.value.pause()
    else if (player.value.state !== 'unload') player.value.play()
  }
  function changeMusicTime(time: number, useOffset: boolean = false) {
    if (useOffset) player.value.time += time
    else player.value.time = time
  }
  function setCurVolume(vol: number) { curVol.value = vol }
  // 导出
  return {
    navExpand,
    showDetail,
    showDrawer,
    db,
    curLibs,
    curItems,
    curList,
    curLib,
    curItem,
    player,
    playerState,
    musicDuration,
    albumPath,
    musicPath,
    musicTitle,
    musicArtist,
    musicPicURL,
    musicColor,
    musicLyrics,
    musicCurTime,
    curVol,
    toggleDetail,
    toggleDrawer,
    loadMusic,
    unloadMusic,
    toggleMusicPlay,
    changeMusicTime,
    setCurVolume,
  }
})
