import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'

/** 循环模式 */
export enum LoopMode {
  /** 列表播放 */ listOnce,
  /** 列表循环 */ listLoop,
  /** 单曲循环 */ singLoop,
  /** 随机播放 */ randLoop
}
/** 曲库数据 */
export const useLibStore = defineStore('store-lib', () => {
  const curLibs = ref<ILibrary[]>([])
  const curItems = shallowRef<ILibItem[]>([])
  const curList = shallowRef<ILibItem[]>([])
  const curLib = ref<ILibrary>()
  const curItem = ref<ILibItem>()// 当前选中项目，手动更新
  const curAlbum = ref<ILibAlbum>()// 当前选中专辑，手动更新
  const curPath = ref('')// 当前音乐路径，监听LoadMsc事件自动更新
  const loopMode = ref<LoopMode>(LoopMode.listOnce)// 循环模式
  // 在所有store初始化后初始化当前曲库和当前音乐
  onMounted(() => {
    initCurLibs()
    initCurPath()
  })
  bus.onMscEnd(loopMusic)// 音乐结束时循环音乐
  bus.onLoopMsc(next => loopMusic(next, false))// 强制循环音乐
  bus.onLoadMsc(path => curPath.value = path)
  bus.onUnloadMsc(() => { curPath.value = ''; curItem.value = undefined })
  // 曲库列表变化时更新当前曲库，注意必须使用deep监听否则无法监听到曲库列表的变化
  watch(curLibs, (curLibs) => {
    // 无曲库时清空当前曲库
    if (curLibs.length === 0) { curLib.value = undefined }
    // 无当前曲库时默认选中第一个
    else if (!curLib.value) { curLib.value = curLibs[0] }
    // 当前曲库不存在时默认选中第一个
    else { curLib.value = curLibs.find(lib => lib.name === curLib.value?.name) ? curLib.value : curLibs[0] }
  }, { deep: true })
  // 当前曲库变化时更新当前曲库项目
  watch(curLib, async (curLib, lastLib) => {
    // 无当前曲库时清空当前曲库项目
    if (!curLib) { curItems.value = [] }
    // 当前曲库无变化时不更新当前曲库项目
    else if (curLib.name === lastLib?.name) { return }
    // 当前曲库存在时更新当前曲库项目
    else { curItems.value = await window.api.getItems(curLib.name) }
  })
  // 初始化曲库表和当前曲库
  function initCurLibs() { window.api.getLibraries().then(libs => curLibs.value = libs) }
  // 初始化最后播放的音乐并取消自动播放
  function initCurPath() { if (curPath.value) bus.emLoadMsc(curPath.value, false) }
  /** 处理音乐循环 @param next 是否播放下/上一首 @param end 是否当前音乐自然结束 */
  function loopMusic(next: boolean = true, end: boolean = true) {
    let loadIdx = -1// 加载音乐在curList中的索引
    let loadPath = ''// 加载音乐路径
    let loadMode = false// 加载音乐是否自动播放
    // 加载当前音乐：curList为空
    if (curList.value.length === 0) { loadPath = curPath.value }
    else {
      const curIdx = curList.value.findIndex(item => item.path === curPath.value)
      if (loopMode.value === LoopMode.randLoop) {
        // 加载随机音乐：循环模式为随机播放
        const randomIdx = Math.floor(Math.random() * (curList.value.length - 1))
        loadIdx = randomIdx >= curIdx ? randomIdx + 1 : randomIdx
      } else if (next && end && loopMode.value === LoopMode.singLoop) {
        // 加载当前音乐：播放下一首，且当前音乐自然结束，且循环模式为单曲循环
        loadIdx = curIdx === -1 ? 0 : curIdx
      } else if (next && (!end || loopMode.value !== LoopMode.singLoop)) {
        // 加载下一首：播放下一首，且循环模式不为单曲循环，或当前音乐非自然结束
        loadIdx = (curIdx === -1 || curIdx === curList.value.length - 1) ? 0 : curIdx + 1
      } else if (!next) {
        // 加载上一首: 播放上一首
        loadIdx = curIdx === -1 ? 0 : curIdx === 0 ? curList.value.length - 1 : curIdx - 1
      }
      loadPath = curList.value[loadIdx].path
      // 音乐自然结束时：循环模式为列表单次且加载音乐为列表第一首时不自动播放，其余情况自动播放
      // 音乐非自然结束时：音乐播放状态为播放时自动播放，否则不自动播放，此处全部设置为不自动播放
      // 注意：非自然结束且播放状态为播放时，音乐加载函数会忽略传入的自动播放参数，其余情况不自动播放
      // 注意：此处的非自然状态不包括直接点击音乐进行播放的情况，因为此时不会触发音乐循环函数
      loadMode = end ? (loopMode.value === LoopMode.listOnce ? loadIdx !== 0 : true) : false
    }
    curItem.value = loadIdx === -1 ? undefined : curList.value[loadIdx]
    bus.emLoadMsc(loadPath, loadMode)
  }
  return {
    /** 所有曲库列表，只读 */ curLibs,
    /** 当前曲库项目，只读 */ curItems,
    /** 当前播放列表 */ curList,
    /** 当前曲库 */ curLib,
    /** 当前选中项目 */ curItem,
    /** 当前选中专辑 */ curAlbum,
    /** 当前音乐路径，只读 */ curPath,
    /** 循环模式 */ loopMode
  }
}, {
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['curLib', 'curItem', 'curAlbum', 'curPath', 'loopMode'] }]
  }
})
