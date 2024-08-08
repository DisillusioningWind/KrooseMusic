import mitt from 'mitt'

export const emitter = mitt()
export const events = {
  /** 滑块拖动完毕 @param number 当前值 */
  sliderDragCur: 'sliderDragCur',
  /** 滑块显示当前值 @param number 当前值 */
  sliderShowCur: 'sliderShowCur',
  /** 音乐重置 @param void */
  musicReset: 'musicReset',
  /** 音乐播放 @param void */
  musicPlay: 'musicPlay',
  /** 音乐暂停 @param void */
  musicPause: 'musicPause',
  /** 音乐停止 @param void */
  musicStop: 'musicStop',
  /** 音乐结束 @param void */
  musicEnd: 'musicEnd',
  /** 音乐加载完成 @param void */
  musicCanPlay: 'musicCanPlay',
  /** 音乐更新当前值 @param number 当前值 */
  musicUpdateCur: 'musicUpdateCur',
  /**
   * 菜单选择选项
   * @param number uid, 监听组件标识
   * @param string value, 选项名称
   */
  menuSelect: 'menuSelect',
}
