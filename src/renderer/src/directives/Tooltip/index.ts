import type { Directive } from "vue"
import bus from '@renderer/utils/emitter'
let tooltipTimer: NodeJS.Timeout | undefined
function showTooltip(el: HTMLElement, delay: number, overshow: boolean) {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    const text = el.dataset.kTooltip || ''
    const posx = rect.left + rect.width / 2
    const posy = rect.top
    // 当scrollWidth大于offsetWidth或scrollHeight大于offsetHeight时，元素溢出
    const overflow = el.scrollWidth > el.offsetWidth || el.scrollHeight > el.offsetHeight
    const show = text.length > 0 && (!overshow || overflow)
    bus.emChangeTooltipState(show, text, posx, posy)
  }, delay)
}
function hideTooltip() {
  clearTimeout(tooltipTimer)
  bus.emChangeTooltipState(false)
}
/**
 * 悬停提示
 * @modifiers immediate 立即显示
 * @modifiers overflow 溢出才显示
 */
export const vTooltip: Directive<HTMLElement, string | undefined, string> = {
  mounted: (el, { modifiers, value }) => {
    const delay = modifiers.immediate ? 100 : 800
    const overshow = modifiers.overflow || false
    el.dataset.kTooltip = value
    el.addEventListener('mouseenter', () => showTooltip(el, delay, overshow))
    el.addEventListener('mouseleave', hideTooltip)
    el.addEventListener('click', hideTooltip)
  },
  updated: (el, { value }) => { el.dataset.kTooltip = value }
}
