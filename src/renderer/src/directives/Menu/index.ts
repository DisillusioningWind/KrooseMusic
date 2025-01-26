import { Directive } from 'vue'
import KMenu from './KMenu.vue'
// 创建菜单并挂载
const menuDiv = document.createElement('div')
menuDiv.id = 'kMenu'
document.body.appendChild(menuDiv)
const menuApp = createApp(KMenu)
const menuCom = menuApp.mount(menuDiv) as InstanceType<typeof KMenu>
// 事件处理
function showMenu(ev: MouseEvent, items: IMenuItem[]) {
  menuCom.items = items
  menuCom.onOpenMenu(ev)
}
function prevMenu(ev: MouseEvent) {
  ev.preventDefault()
  ev.stopPropagation()
}
/** 点击菜单 */
export const vMenu: Directive<HTMLElement, IMenuItem[]> = {
  mounted: (el, binding) => el.addEventListener('click', (ev) => showMenu(ev, binding.value))
}
/** 右键菜单 */
export const vCtxMenu: Directive<HTMLElement, IMenuItem[]> = {
  mounted: (el, binding) => el.addEventListener('contextmenu', (ev) => showMenu(ev, binding.value))
}
/** 禁止右键菜单 */
export const vNoCtxMenu: Directive<HTMLElement> = {
  mounted: (el) => el.addEventListener('contextmenu', prevMenu)
}
