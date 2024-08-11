import KTooltip from "./KTooltip.vue"

const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'kTooltip'
document.body.appendChild(tooltipDiv)
const tooltipApp = createApp(KTooltip)
const tooltipCom: any = tooltipApp.mount(tooltipDiv)
const tooltipCtl = new AbortController()
let tooltipTimer: any = null
// 事件处理
const showText = (el: HTMLElement) => {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    const text = el.getAttribute('tooltip-text') || ''
    tooltipCom.text = text
    tooltipCom.show = text.length > 0
    tooltipCom.top = rect.top
    tooltipCom.left = rect.left + rect.width / 2
  }, 800)
}
const hideText = () => {
  clearTimeout(tooltipTimer)
  tooltipCom.show = false
}
/** 悬停提示 */
export const vTooltip = {
  mounted: (el: HTMLElement, binding: { value: string}) => {
    el.setAttribute('tooltip-text', binding.value)
    el.addEventListener('mouseenter', () => showText(el), { signal: tooltipCtl.signal })
    el.addEventListener('mouseleave', hideText)
    el.addEventListener('click', hideText)
  },
  updated: (el: HTMLElement, binding: { value: string }) => {
    el.setAttribute('tooltip-text', binding.value)
  },
  beforeUnmount: (el: HTMLElement) => {
    tooltipCtl.abort()
    el.removeEventListener('mouseleave', hideText)
    el.removeEventListener('click', hideText)
  }
}
