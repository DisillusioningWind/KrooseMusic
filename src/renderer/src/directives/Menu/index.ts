import KMenu from './KMenu.vue'

const menuDiv = document.createElement('div')
menuDiv.id = 'kMenu'
document.body.appendChild(menuDiv)
const menuApp = createApp(KMenu)
const menuCom = menuApp.mount(menuDiv) as any
// 事件处理
const showMenu = (ev: MouseEvent, menuItems: IMenuItem[]) => {
  menuCom.menuItems = menuItems
  menuCom.onOpenMenu(ev)
}
const prevMenu = (ev: MouseEvent) => {
  ev.preventDefault()
  ev.stopPropagation()
}
/** 右键菜单 */
export const vCtxMenu = {
  mounted: (el: HTMLElement, binding: { value: IMenuItem[] }) => {
    el.addEventListener('contextmenu', (ev) => showMenu(ev, binding.value))
  }
}
/** 点击菜单 */
export const vMenu = {
  mounted: (el: HTMLElement, binding: { value: IMenuItem[] }) => {
    el.addEventListener('click', (ev) => showMenu(ev, binding.value))
  }
}
/** 禁止右键菜单 */
export const vNoCtxMenu = {
  mounted: (el: HTMLElement) => el.addEventListener('contextmenu', prevMenu)
}
