import KTooltip from "./KTooltip.vue"

const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'kTooltip'
document.body.appendChild(tooltipDiv)
const tooltipApp = createApp(KTooltip)
const tooltipCom = tooltipApp.mount(tooltipDiv) as any
let tooltipTimer = null as any
// 事件处理
const showText = (el: HTMLElement, delay: number, overShow: boolean) => {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    const text = el.getAttribute('tooltip-text') || ''
    tooltipCom.text = text
    // 当scrollWidth大于offsetWidth时，文本溢出
    tooltipCom.show = text.length > 0 && (overShow ? el.scrollWidth > el.offsetWidth : true)
    tooltipCom.top = rect.top
    tooltipCom.left = rect.left + rect.width / 2
  }, delay)
}
const hideText = () => {
  clearTimeout(tooltipTimer)
  tooltipCom.show = false
}
type TooltipModifiers = {
  immediate?: boolean
  overflow?: boolean
}
/**
 * 悬停提示
 * @modifiers immediate 立即显示
 * @modifiers overflow 溢出才显示
 */
export const vTooltip = {
  mounted: (el: HTMLElement, binding: { value: string, modifiers: TooltipModifiers }) => {
    const delay = binding.modifiers.immediate ? 0 : 800
    const overShow = binding.modifiers.overflow || false
    el.setAttribute('tooltip-text', binding.value)
    el.addEventListener('mouseenter', () => showText(el, delay, overShow))
    el.addEventListener('mouseleave', hideText)
    el.addEventListener('click', hideText)
  },
  updated: (el: HTMLElement, binding: { value: string }) => {
    el.setAttribute('tooltip-text', binding.value)
  }
}
