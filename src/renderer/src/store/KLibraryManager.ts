import { defineStore } from 'pinia'
import { bus, Events } from '@renderer/utils/EventUtil'

/** 数据库管理 */
export const getLibraryManager = defineStore('store-library', () => {
  const curLibs = ref<ILibrary[]>([])
  const curLib = ref<ILibrary>()
  const curItems = shallowRef<ILibItem[]>([])

  onMounted(() => { initCurLibs() })

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
    else if (curLib.id === lastLib?.id) { return }
    // 当前曲库存在时更新当前曲库项目
    else { curItems.value = await window.api.db.getLibItems(curLib.id) }
  })

  // 初始化曲库
  async function initCurLibs() {
    curLibs.value = await window.api.db.getLibraries()
  }
  // 创建曲库
  async function createLib(libName: string, libPath: string, libMode: LibMode) {
    // todo 更好的实现
    const libID = await window.api.db.addLibrary(libName, libPath, libMode)
    curLibs.value.push({ id: libID, mode: libMode, name: libName, path: libPath })
    console.info(`createLib succes: libID=${libID}`)
  }
  // 删除曲库
  async function deleteLib(libID: number) {
    await window.api.db.delLibrary(libID)
    const libIdx = curLibs.value.findIndex(lib => lib.id === libID)
    if (libIdx !== -1) {
      curLibs.value.splice(libIdx, 1)
      console.log(`deleteLib succes: libID=${libID}`)
    } else {
      console.log(`deleteLib failed: cannot find lib, libID=${libID}`)
    }
  }

  return {
    /** 所有曲库列表 */
    curLibs,
    /** 当前曲库项目 */
    curItems,
    /** 当前曲库 */
    curLib,
    /** 创面曲库 @param mode 曲库模式 */
    createLib,
    /** 删除曲库 @param libID 曲库ID */
    deleteLib,
  }
}, {
  persist: {
    enabled: true,
    strategies: [{ storage: localStorage, paths: ['curLib'] }]
  }
})
