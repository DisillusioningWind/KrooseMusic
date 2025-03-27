import { Directive } from 'vue'
import bus from '@renderer/utils/emitter'
// 阻止原生事件并传递鼠标坐标
function showMenu(ev: MouseEvent, items: IMenuItem[]) {
  ev.preventDefault()
  ev.stopPropagation()
  bus.emChangeMenuState(items, ev.clientX, ev.clientY)
}
function prevMenu(ev: MouseEvent) {
  ev.preventDefault()
  ev.stopPropagation()
}
/** 点击菜单 */
export const vMenu: Directive<HTMLElement, IMenuItem[]> = { mounted: (el, { value }) => el.addEventListener('click', ev => showMenu(ev, value)) }
/** 右键菜单 */
export const vCtxMenu: Directive<HTMLElement, IMenuItem[]> = { mounted: (el, { value }) => el.addEventListener('contextmenu', ev => showMenu(ev, value)) }
/** 禁止右键菜单 */
export const vNoCtxMenu: Directive<HTMLElement> = { mounted: (el) => el.addEventListener('contextmenu', prevMenu) }
