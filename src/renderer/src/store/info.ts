import { defineStore } from 'pinia'
import bus from '@renderer/utils/emitter'

/** 当前音乐信息 */
export const useInfoStore = defineStore('store-info', () => {
  const mscPath = ref('')
  const mscTitle = ref('')
  const mscArtist = ref('')
  const mscPicURL = ref('')
  const mscColor = ref('#1a5d8e')
  const mscLyrics = shallowRef<ILyric[]>([])
  // 监听事件
  bus.onLoadMsc(loadMusicInfo)// 加载音乐信息
  bus.onUnloadMsc(unloadMusicInfo)// 卸载音乐信息
  // 事件处理
  async function loadMusicInfo(path: string) {
    const lyrcRes = window.ipc.invoke('getLyricFromFile', path)
    const infoRes = window.ipc.invoke('getInfoFromFile', path)
    const { tag, mainColor } = await infoRes as IMusicInfo
    mscLyrics.value = await lyrcRes as ILyric[]
    mscPath.value = path
    mscTitle.value = tag.title || window.path.basename(path, window.path.extname(path))
    mscArtist.value = tag.artist || '未知艺术家'
    mscPicURL.value = (tag.picture) ? URL.createObjectURL(new Blob([tag.picture[0].data])) : ''
    mscColor.value = mainColor
  }
  function unloadMusicInfo() {
    mscPath.value = ''
    mscTitle.value = ''
    mscArtist.value = ''
    URL.revokeObjectURL(mscPicURL.value)
    mscPicURL.value = ''
    mscColor.value = '#1a5d8e'
    mscLyrics.value = []
  }
  return {
    /** 音乐路径 */
    mscPath,
    /** 音乐标题 */
    mscTitle,
    /** 音乐艺术家 */
    mscArtist,
    /** 音乐封面URL */
    mscPicURL,
    /** 音乐主色调 */
    mscColor,
    /** 音乐歌词 */
    mscLyrics
  }
})
