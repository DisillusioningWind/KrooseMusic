import KTooltip from "./KTooltip.vue"

const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'kTooltip'
document.body.appendChild(tooltipDiv)
const tooltipApp = createApp(KTooltip)
const tooltipCom: any = tooltipApp.mount(tooltipDiv)
let tooltipTimer: any = null

const showText = (el: HTMLElement, value: string) => {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    tooltipCom.text = value
    tooltipCom.show = true
    tooltipCom.dtop = rect.top
    tooltipCom.dleft = rect.left + rect.width / 2
  }, 800)
}
const hideText = () => {
  clearTimeout(tooltipTimer)
  tooltipCom.show = false
}
/** 悬停提示 */
export const vTooltip = {
  mounted: (el: HTMLElement, binding: { value: string }) => {
    el.addEventListener('mouseenter', () => showText(el, binding.value))
    el.addEventListener('mouseleave', hideText)
    el.addEventListener('click', hideText)
  },
  unmounted: (el: HTMLElement) => {
    el.removeEventListener('mouseenter', () => showText(el, ''))
    el.removeEventListener('mouseleave', hideText)
    el.removeEventListener('click', hideText)
    tooltipApp.unmount()
    tooltipDiv.remove()
  }
}
