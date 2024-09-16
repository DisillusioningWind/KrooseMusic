import { defineStore } from 'pinia'
import KDBManager from '@renderer/services/db'
import KPlayer from '@renderer/services/player'
import bus from '@renderer/utils/emitter'

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
  const albumPath = ref('')
  const musicPath = ref('')
  const musicPicURL = ref('')
  const musicLyrics = shallowRef<ILyric[]>([])
  const musicCurTime = ref(0)
  // 初始化
  player.value.initEvents()
  player.value.initHandlers()
  bus.dbOpen(initCurLibs)
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
  // 方法
  async function initCurLibs() {
    curLibs.value = await db.getLibraries()
    if (curLibs.value.length > 0) curLib.value = curLibs.value[0]
  }
  function toggleDetail() { showDetail.value = !showDetail.value }
  function toggleDrawer() { showDrawer.value = !showDrawer.value }
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
    albumPath,
    musicPath,
    musicPicURL,
    musicLyrics,
    musicCurTime,
    toggleDetail,
    toggleDrawer,
  }
})
