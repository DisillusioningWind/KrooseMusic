import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'
export { useUIStore } from '@renderer/store/interface'
export { useInfoStore } from '@renderer/store/info'
export { useAudioStore } from '@renderer/store/audio'

// 曲库数据
export const useStore = defineStore('store-main', () => {
  const curLibs = shallowRef<ILibrary[]>([])
  const curItems = shallowRef<ILibItem[]>([])
  const curList = shallowRef<ILibItem[]>([])
  const curLib = ref<ILibrary>()
  const curItem = ref<ILibItem>()// 当前选中项目，与curMsc不同点在于curItem在asmr模式下代表当前专辑
  const curMsc = ref<ILibItem>()// 当前播放音乐，只需要其中的path值
  // 监听事件并初始化
  initCurLibs()
  bus.onMscEnd(loopMusic)
  bus.onLoopMsc(loopMusic)
  // 曲库列表变化时更新当前曲库
  watch(curLibs, (curLibs) => {
    // 无曲库时清空当前曲库
    if (curLibs.length === 0) { curLib.value = undefined }
    // 无当前曲库时默认选中第一个
    else if (!curLib.value) { curLib.value = curLibs[0] }
    // 当前曲库不存在时清空当前曲库
    else if (curLib.value) { curLib.value = curLibs.find(lib => lib.name === curLib.value?.name) }
  })
  // 当前曲库变化时更新当前曲库项目
  watch(curLib, async (curLib, lastLib) => {
    // 无当前曲库时清空当前曲库项目
    if (!curLib) { curItems.value = [] }
    // 当前曲库无变化时不更新当前曲库项目
    else if ( curLib.name === lastLib?.name ) { return }
    // 当前曲库存在时更新当前曲库项目
    else { curItems.value = await window.api.getItems(curLib.name) }
  })
  // 加载音乐，这里是唯一的入口
  watch(curMsc, (curMsc) => {
    if (!curMsc) return
    bus.emLoadMsc(curMsc.path)
  })
  // 初始化曲库表和当前曲库
  async function initCurLibs() { curLibs.value = await window.api.getLibraries() }
  // 处理音乐循环
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
