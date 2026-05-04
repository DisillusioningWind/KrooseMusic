import { EventEmitter } from 'eventemitter3'

export enum Events {
  /** 音乐播放结束 */
  musicFinish = 'musicFinish',
  /** 音乐加载完成 @param path 音乐路径 */
  musicLoaded = 'musicLoaded',
  /** 音乐卸载完成 @param path 音乐路径 */
  musicUnload = 'musicUnload',
  /** 音乐进度更新 @param time 当前进度 */
  musicUpdate = 'musicUpdate',
  /** 音乐时长改变 @param dura 音乐时长 */
  musicDuraChange = 'musicDuraChange',
  /** 音乐状态改变 @param stat 音乐状态 */
  musicStatChange = 'musicStatChange',
  /** 右键菜单状态改变 @param items 菜单项列表 @param x x坐标 @param y y坐标 */
  menuStatChange = 'menuStatChange',
  /** 悬停提示状态改变 @param show 是否显示 @param text 文本 @param x x坐标 @param y y坐标 */
  tooltipStatChange = 'tooltipStatChange',
}

interface EventsMap {
  [Events.musicFinish]: () => void
  [Events.musicLoaded]: (path: string) => void
  [Events.musicUnload]: (path: string) => void
  [Events.musicUpdate]: (time: number) => void
  [Events.musicStatChange]: (stat: string) => void
  [Events.musicDuraChange]: (dura: number) => void
  [Events.menuStatChange]: (items: IMenuItem[], x: number, y: number) => void
  [Events.tooltipStatChange]: (show: boolean, text?: string, x?: number, y?: number) => void
}

/** 事件总线 */
const bus = new EventEmitter<EventsMap>()

export { bus }