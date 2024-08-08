import Tooltip from "./Tooltip.vue"

const tooltipDiv = document.createElement('div')
tooltipDiv.id = 'k-tooltip'
document.body.appendChild(tooltipDiv)
const tooltipApp = createApp(Tooltip)
const tooltipCom: any = tooltipApp.mount(tooltipDiv)
let tooltipTimer: any = null

const showText = (el: HTMLElement, value: string) => {
  tooltipTimer = setTimeout(() => {
    const rect = el.getBoundingClientRect()
    tooltipCom.text = value
    tooltipCom.show = true
    tooltipCom.dtop = rect.top
    tooltipCom.dleft = rect.left + rect.width / 2
  }, 700)
}
const hideText = () => {
  clearTimeout(tooltipTimer)
  tooltipCom.show = false
}

export const vTooltip = {
  mounted: (el: HTMLElement, binding: { value: string }) => {
    el.addEventListener('mouseenter', () => showText(el, binding.value))
    el.addEventListener('mouseleave', hideText)
  },
  unmounted: (el: HTMLElement) => {
    el.removeEventListener('mouseenter', () => showText(el, ''))
    el.removeEventListener('mouseleave', hideText)
    tooltipApp.unmount()
    tooltipDiv.remove()
  }
}
