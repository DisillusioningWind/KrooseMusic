import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'
import KDBManager from '@renderer/services/db'
export { useAudioStore } from '@renderer/store/audio'
export { useInfoStore } from '@renderer/store/info'

export const useStore = defineStore('store-main', () => {
  // 界面状态
  const navExpand = ref(false)
  const showDetail = ref(false)
  const showDrawer = ref(false)
  // 曲库数据
  const db = new KDBManager()
  const curLibs = shallowRef<ILibrary[]>([])
  const curLib = ref<ILibrary>()
  const curItems = shallowRef<ILibItem[]>([])
  const curItem = ref<ILibItem>()// 当前选中项目，与curMsc不同点在于curItem在asmr模式下代表当前专辑
  const curMsc = ref<ILibItem>()// 当前播放音乐，只需要其中的path值
  const curList = shallowRef<ILibItem[]>([])
  // 监听事件
  bus.onChangeDetailState(switchDetailState)
  bus.onChangeDrawerState(switchDrawerState)
  bus.onDbOpen(initLibs)// 初始化当前曲库
  bus.onMscEnd(loopMusic)
  bus.onLoopMsc(loopMusic)
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
  watch(curMsc, (curMsc) => {
    if (!curMsc) return
    bus.emLoadMsc(curMsc.path)
  })
  // 事件处理
  async function initLibs() {
    curLibs.value = await db.getLibraries()
    // 若无曲库或已设置当前曲库则返回
    if (curLibs.value.length === 0 || curLib.value) return
    curLib.value = curLibs.value[0]
  }
  function loopMusic(next = true) {
    const idx = curList.value.findIndex(item => item.path === curItem.value?.path)
    if (idx === -1) {
      // WARN: 未找到当前音乐
    } else if (idx === curList.value.length - 1 && next) {
      // TODO: 循环模式
    } else if (idx === 0 && !next) {
      // WARN: 已经是第一首音乐
    } else {
      const idxLoad = next ? idx + 1 : idx - 1
      bus.emLoadMsc(curList.value[idxLoad].path)
      curItem.value = curList.value[idxLoad]
    }
  }
  function switchDetailState() { showDetail.value = !showDetail.value }
  function switchDrawerState() { showDrawer.value = !showDrawer.value }
  // 导出
  return {
    navExpand,
    showDetail,
    showDrawer,
    db,
    curLibs,
    curLib,
    curItems,
    curItem,
    curMsc,
    curList
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['curLib', 'curItem', 'curMsc'] }
    ]
  }
})
