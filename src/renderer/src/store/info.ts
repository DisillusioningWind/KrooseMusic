import { defineStore } from 'pinia'
import { basename } from '@renderer/utils/tools'
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
  function loadMusicInfo(path: string) {
    window.api.loadMusicLyrics(path).then(lyrics => mscLyrics.value = lyrics)
    window.api.loadMusicInfo(path).then(({ tag, mainColor }) => {
      mscPath.value = path
      mscColor.value = mainColor
      mscTitle.value = tag.title || basename(path)
      mscArtist.value = tag.artist || '未知艺术家'
      if (mscPicURL.value) URL.revokeObjectURL(mscPicURL.value)
      mscPicURL.value = tag.picture ? URL.createObjectURL(new Blob([tag.picture[0].data])) : ''
    })
  }
  function unloadMusicInfo() {
    URL.revokeObjectURL(mscPicURL.value)
    mscPicURL.value = ''
    mscPath.value = ''
    mscTitle.value = ''
    mscLyrics.value = []
    mscArtist.value = ''
    mscColor.value = '#1a5d8e'
  }
  return {
    /** 音乐路径 */ mscPath,
    /** 音乐标题 */ mscTitle,
    /** 音乐歌词 */ mscLyrics,
    /** 音乐艺术家 */ mscArtist,
    /** 音乐主色调 */ mscColor,
    /** 音乐封面URL */ mscPicURL
  }
})
