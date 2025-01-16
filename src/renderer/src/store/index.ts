import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'
export { useUIStore } from '@renderer/store/interface'
export { useInfoStore } from '@renderer/store/info'
export { useAudioStore } from '@renderer/store/audio'

// 曲库数据
export const useStore = defineStore('store-main', () => {
  const curLibs = shallowRef<ILibrary[]>([])
  const curLib = ref<ILibrary>()
  const curItems = shallowRef<ILibItem[]>([])
  const curItem = ref<ILibItem>()// 当前选中项目，与curMsc不同点在于curItem在asmr模式下代表当前专辑
  const curMsc = ref<ILibItem>()// 当前播放音乐，只需要其中的path值
  const curList = shallowRef<ILibItem[]>([])
  // 监听事件并初始化
  initLibs()
  bus.onMscEnd(loopMusic)
  bus.onLoopMsc(loopMusic)
  // 曲库变化时更新当前曲库项目
  watch(curLib, async (curLib) => {
    if (!curLib) return
    curItems.value = await window.api.getItems(curLib.name)
  })
  // 加载音乐，这里是唯一的入口
  watch(curMsc, (curMsc) => {
    if (!curMsc) return
    bus.emLoadMsc(curMsc.path)
  })
  // 初始化曲库表和当前曲库
  async function initLibs() {
    curLibs.value = await window.api.getLibraries()
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
