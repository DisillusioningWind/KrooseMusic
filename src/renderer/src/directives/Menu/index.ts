import KMenu from './KMenu.vue'

const menuDiv = document.createElement('div')
menuDiv.id = 'kMenu'
document.body.appendChild(menuDiv)
const menuApp = createApp(KMenu)
const menuCom: any = menuApp.mount(menuDiv)

const showMenu = (ev: MouseEvent, uid: number, menuItems: IMenuItem[]) => {
  menuCom.menuItems = menuItems
  menuCom.menuUID = uid
  menuCom.onOpenMenu(ev)
}
/** 右键菜单 */
export const vCtxMenu = {
  mounted: (el: HTMLElement, binding: { value: IMenuItem[], instance: ComponentPublicInstance }) => {
    el.addEventListener('contextmenu', (ev) => showMenu(ev, binding.instance.$.uid, binding.value))
  }
}
/** 点击菜单 */
export const vMenu = {
  mounted: (el: HTMLElement, binding: { value: IMenuItem[], instance: ComponentPublicInstance }) => {
    el.addEventListener('click', (ev) => showMenu(ev, binding.instance.$.uid, binding.value))
  }
}
/** 禁止右键菜单 */
export const vNoCtxMenu = {
  mounted: (el: HTMLElement) => el.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation() }),
  unmounted: (el: HTMLElement) => el.removeEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation() })
}
