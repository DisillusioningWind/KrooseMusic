import { Directive } from "vue"
import KTooltip from "./KTooltip.vue"

const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'kTooltip'
document.body.appendChild(tooltipDiv)
const tooltipApp = createApp(KTooltip)
const tooltipCom = tooltipApp.mount(tooltipDiv) as InstanceType<typeof KTooltip>
let tooltipTimer: NodeJS.Timeout | null = null
// 事件处理
const showText = (el: HTMLElement, delay: number, overShow: boolean) => {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    const text = el.dataset.kTooltip || ''
    // 当scrollWidth大于offsetWidth时，文本溢出
    tooltipCom.show = text.length > 0 && (overShow ? el.scrollWidth > el.offsetWidth : true)
    tooltipCom.text = text
    tooltipCom.x = rect.left + rect.width / 2
    tooltipCom.y = rect.top
  }, delay)
}
const hideText = () => {
  if (tooltipTimer) { clearTimeout(tooltipTimer) }
  tooltipCom.show = false
}
/**
 * 悬停提示
 * @modifiers immediate 立即显示
 * @modifiers overflow 溢出才显示
 */
export const vTooltip: Directive<HTMLElement, string> = {
  mounted: (el, binding) => {
    const delay = binding.modifiers.immediate ? 100 : 800
    const overShow = binding.modifiers.overflow || false
    el.dataset.kTooltip = binding.value
    el.addEventListener('mouseenter', () => showText(el, delay, overShow))
    el.addEventListener('mouseleave', hideText)
    el.addEventListener('click', hideText)
  },
  updated: (el, binding) => { el.dataset.kTooltip = binding.value }
}
