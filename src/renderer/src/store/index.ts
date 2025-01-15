import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'
import KDBManager from '@renderer/services/db'
export { useUIStore } from '@renderer/store/interface'
export { useInfoStore } from '@renderer/store/info'
export { useAudioStore } from '@renderer/store/audio'

// 曲库数据
export const useStore = defineStore('store-main', () => {
  const db = new KDBManager()
  const curLibs = shallowRef<ILibrary[]>([])
  const curLib = ref<ILibrary>()
  const curItems = shallowRef<ILibItem[]>([])
  const curItem = ref<ILibItem>()// 当前选中项目，与curMsc不同点在于curItem在asmr模式下代表当前专辑
  const curMsc = ref<ILibItem>()// 当前播放音乐，只需要其中的path值
  const curList = shallowRef<ILibItem[]>([])
  // 监听事件
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
  // 加载音乐唯一方法
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
      curItem.value = curList.value[idxLoad]
      curMsc.value = curItem.value
    }
  }
  // 导出
  return {
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
