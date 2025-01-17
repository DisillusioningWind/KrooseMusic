import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'

/** 曲库数据 */
export const useLibStore = defineStore('store-lib', () => {
  const curLibs = shallowRef<ILibrary[]>([])
  const curItems = shallowRef<ILibItem[]>([])
  const curList = shallowRef<ILibItem[]>([])
  const curLib = ref<ILibrary>()
  const curItem = ref<ILibItem>()// 当前选中项目
  const curPath = ref('')// 当前音乐路径
  // 在所有store初始化后初始化当前曲库和当前音乐
  onMounted(() => {
    initCurLibs()
    initCurPath()
  })
  bus.onMscEnd(loopMusic)
  bus.onLoopMsc(loopMusic)
  bus.onLoadMsc(path => curPath.value = path)
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
  // 初始化曲库表和当前曲库
  async function initCurLibs() { curLibs.value = await window.api.getLibraries() }
  // 初始化最后播放的音乐并取消自动播放
  function initCurPath() {
    const lib = JSON.parse(localStorage.getItem('store-lib') || 'null')
    if (lib?.curPath) { bus.emLoadMsc(lib.curPath, false) }
  }
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
      bus.emLoadMsc(curItem.value.path)
    }
  }
  // 导出
  return {
    /** 所有曲库列表 */
    curLibs,
    /** 当前曲库项目 */
    curItems,
    /** 当前播放列表 */
    curList,
    /** 当前曲库 */
    curLib,
    /** 当前选中项目 */
    curItem,
    /** 当前音乐路径 */
    curPath
  }
}, {
  persist: {
    enabled: true,
    strategies: [
      { storage: localStorage, paths: ['curLib', 'curItem', 'curPath'] }
    ]
  }
})
