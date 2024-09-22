import { Directive } from 'vue'
import KMenu from './KMenu.vue'

const menuDiv = document.createElement('div')
menuDiv.id = 'kMenu'
document.body.appendChild(menuDiv)
const menuApp = createApp(KMenu)
const menuCom = menuApp.mount(menuDiv) as InstanceType<typeof KMenu>
// 事件处理
const showMenu = (ev: MouseEvent, menuItems: IMenuItem[]) => {
  menuCom.menuItems = menuItems
  menuCom.onOpenMenu(ev)
}
const prevMenu = (ev: MouseEvent) => {
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
