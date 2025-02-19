import { Directive } from "vue"
import KTooltip from "./KTooltip.vue"
// 创建悬停提示组件并挂载
const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'kTooltip'
document.body.appendChild(tooltipDiv)
const tooltipApp = createApp(KTooltip)
const tooltipCom = tooltipApp.mount(tooltipDiv) as InstanceType<typeof KTooltip>
let tooltipTimer: NodeJS.Timeout | undefined
// 事件处理
function showText(el: HTMLElement, delay: number, overShow: boolean) {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    const text = el.dataset.kTooltip || ''
    // 当scrollWidth大于offsetWidth或scrollHeight大于offsetHeight时，元素溢出
    const overflow = el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight
    tooltipCom.show = text.length > 0 && (overShow ? overflow : true)
    tooltipCom.text = text
    tooltipCom.x = rect.left + rect.width / 2
    tooltipCom.y = rect.top
  }, delay)
}
function hideText() {
  clearTimeout(tooltipTimer)
  tooltipCom.show = false
}
/**
 * 悬停提示
 * @modifiers immediate 立即显示
 * @modifiers overflow 溢出才显示
 */
export const vTooltip: Directive<HTMLElement, string | undefined, string> = {
  mounted: (el, { modifiers, value }) => {
    const delay = modifiers.immediate ? 100 : 800
    const overShow = modifiers.overflow || false
    el.dataset.kTooltip = value || ''
    el.addEventListener('mouseenter', () => showText(el, delay, overShow))
    el.addEventListener('mouseleave', hideText)
    el.addEventListener('click', hideText)
  },
  updated: (el, { value }) => { el.dataset.kTooltip = value }
}
