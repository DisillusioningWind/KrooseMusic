import mitt from 'mitt'

export const emitter = mitt()
export const events = {
  /** 滑块拖动完毕 @param number 当前值 */
  sliderDragCur: 'sliderDragCur',
  /** 滑块显示当前值 @param number 当前值 */
  sliderShowCur: 'sliderShowCur',
  /** 滑块重置 */
  sliderReset: 'sliderReset',
}
