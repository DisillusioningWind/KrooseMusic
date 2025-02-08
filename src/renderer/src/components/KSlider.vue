<template>
  <div class="KSlider" ref="slider">
    <div class="use"></div>
    <div class="btn" :tip="format(cur)"></div>
    <div class="unuse"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 最小值，默认0 */
  min?: number,
  /** 最大值，默认100 */
  max?: number,
  /** 当前值 */
  cur: number,
  /** 是否禁用，默认不禁用 */
  disable?: boolean,
  /** 是否显示提示，默认不显示 */
  tooltip?: boolean,
  /** 提示格式化函数，默认显示原值 */
  format?: (v: number) => string
}>()
const emit = defineEmits<{
  /** 当前值改变 */
  update: [v: number],
  /** 拖动结束 */
  drag: [v: number]
}>()

const min = computed(() => props.min || 0)
const max = computed(() => props.max || 100)
const cur = ref(props.cur)
const disable = computed(() => props.disable)
const tooltip = computed(() => props.tooltip && !props.disable) //禁用时不显示提示
const format = computed(() => props.format || ((v:number) => v.toString()))
const slider = ref<HTMLElement>()
const sliderWidth = ref(1)
const len = computed(() => max.value - min.value)
/** 当前值占总范围百分比，分数格式 */
const perCur = computed(() => cur.value / len.value)
/** 已使用滑动条长度占滑动条总长百分比，百分比格式，perCur为1时，已使用滑动条右端与滑动条右端距离为按钮宽度（21px），以此换算 */
const perUse = computed(() => ((sliderWidth.value - 21) * perCur.value) / sliderWidth.value * 100)
/** 拖动状态，仅有滑动和拖动两个状态 */
let state: 'drag' | 'slide' = 'slide'
/** 滑动条总长监听器 */
let ob = new ResizeObserver(() => { sliderWidth.value = slider.value?.offsetWidth || 1 })

//监听外部传入的cur，仅当state为slide且新旧值不等时更新内部cur
watch(() => props.cur, (newCur, oldCur) => {
  if (state === 'slide' && newCur !== oldCur) { cur.value = newCur }
})
//限制内部cur范围，并通知父组件当前值已改变
watch(cur, (newCur, oldCur) => {
  if (newCur < min.value) { cur.value = min.value }
  else if (newCur > max.value) { cur.value = max.value }
  //如果新旧值相等则不通知，避免死循环
  if (newCur === oldCur) return
  emit('update', cur.value)
})

onMounted(() => {
  if (!slider.value) {
    console.error('KSlider: slider is null')
    return
  }
  slider.value.addEventListener('mousedown', startDrag)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
  ob.observe(slider.value)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
  ob.disconnect()
})

/** 拖动Slider时perCur的值需要计算按钮的宽度，分数格式 */
function getPerCur(clientX: number) {
  if (!slider.value) { return 0 }
  else { return (clientX - slider.value.getBoundingClientRect().x - 10.5) / (slider.value.offsetWidth - 21) }
}
function startDrag(e: MouseEvent) {
  if (disable.value || e.button !== 0) return
  state = 'drag'
  cur.value = getPerCur(e.clientX) * len.value
  e.preventDefault()
}
function onDrag(e: MouseEvent) {
  if (state !== 'drag') return
  cur.value = getPerCur(e.clientX) * len.value
}
function endDrag(e: MouseEvent) {
  if (state !== 'drag') return
  cur.value = getPerCur(e.clientX) * len.value
  state = 'slide'
  emit('drag', cur.value)
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';
$sli-hei: 21px;
$trk-hei: 2px;
$tip-hei: 28px;
$btn-bor-wid: 3px;
$btn-mar-wid: 3px;
$btn-wid: $sli-hei - 2 * $btn-mar-wid;
$btn-hov-col: #ffffffa0;
$trk-use-col: #ffffffff;
$trk-unuse-col: #ffffff40;

.KSlider {
  height: $sli-hei;
  width: 100%;
  min-width: $sli-hei + 1px;
  flex: 1;
  display: flex;
  align-items: center;
  &:hover { >.btn { border-color: $btn-hov-col; } }
  &:active {
    >.btn {
      background-color: $trk-use-col;
      &::before { opacity: v-bind('tooltip?1:0'); }
    }
  }
  >.use {
    height: $trk-hei;
    width: v-bind('perUse+"%"');
    background-color: $trk-use-col;
  }
  >.unuse {
    height: $trk-hei;
    width: 0;
    flex: 1;
    background-color: $trk-unuse-col;
  }
  >.btn {
    position: relative;
    display: v-bind('disable?"none":"block"');
    height: $btn-wid;
    width: $btn-wid;
    margin: $btn-mar-wid;
    border: $btn-bor-wid solid $trk-use-col;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: transparent;
    // 提示
    &::before {
      @include global.k-tool-tip;
      z-index: 1; // 处于顶层
      left: 50%;
      bottom: 28px;
      transform: translate(-50%);
      padding: 0 8px;
      height: $tip-hei;
      line-height: $tip-hei;
      content: attr(tip);
      font-size: 13px;
      font-weight: 400;
      text-align: center;
      opacity: 0;
      transition: opacity .2s;
      pointer-events: none;
    }
  }
}
</style>
