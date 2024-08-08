export const vNoMenu = {
  mounted: (el: HTMLElement) => el.addEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation() }),
  unmounted: (el: HTMLElement) => el.removeEventListener('contextmenu', (e) => { e.preventDefault(); e.stopPropagation() })
}
