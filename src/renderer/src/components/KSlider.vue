<template>
  <div class="KSlider" ref="slider">
    <div class="use" :style="{ width: perUse + '%' }"></div>
    <div class="btn" v-show="!disable" :tip="format(curVal)"></div>
    <div class="unuse"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 最小值，默认0 */ min?: number,
  /** 最大值，默认100 */ max?: number,
  /** 当前值 */ cur: number,
  /** 是否禁用，默认不禁用 */ disable?: boolean,
  /** 提示格式化函数，默认显示原值 */ format?: (v: number) => string
}>()
const emit = defineEmits<{
  /** 当前值改变 */ update: [v: number],
  /** 拖动结束 */ drag: [v: number]
}>()
const min = computed(() => props.min || 0)
const max = computed(() => props.max || 100)
const len = computed(() => max.value - min.value)
const disable = computed(() => props.disable)
const format = computed(() => props.format ?? ((v: number) => v.toString()))
const curval = ref(props.cur)// 内部当前值，由当前值决定perCur和perUse，进而决定已用长度，所以拖动时更新包裹当前值
const curVal = computed({ get: () => curval.value, set: v => curval.value = Math.min(max.value, Math.max(min.value, v)) })// 包裹当前值，限制内部当前值在[min,max]范围内
const slider = ref<HTMLDivElement>()// 滑动条元素
const sliderWidth = ref(21)// 滑动条总长，最低为21px（按钮宽度）
const perCur = computed(() => (curVal.value - min.value) / len.value)// 当前值占总值比例
const perUse = computed(() => ((sliderWidth.value - 21) * perCur.value) / sliderWidth.value * 100)// 滑动条已用长度占总长度百分比，perCur为1时，已用部分右端与滑动条右端距离为按钮宽度
let state: 'drag' | 'slide' = 'slide'// 拖动状态，仅有滑动和拖动两个状态
let ob = new ResizeObserver(() => { sliderWidth.value = slider.value?.offsetWidth ?? 21 })// 滑动条总长监听器
// 监听外部当前值，当为滑动状态时更新包裹当前值
watch(() => props.cur, newCur => { if (state === 'slide') { curVal.value = newCur } })
// 监听内部当前值，当值改变时更新外部当前值
watch(curval, newCur => emit('update', newCur))
// 监听页面鼠标移动事件及滑动条元素宽度变化
onMounted(() => {
  slider.value!.addEventListener('mousedown', startDrag)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
  ob.observe(slider.value!)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
  ob.disconnect()
})
// 拖动滑动条时根据鼠标位置、滑动条位置和宽度计算当前值
function getDragCur(clientX: number) { return slider.value ? (clientX - slider.value.getBoundingClientRect().x - 10.5) / (slider.value.offsetWidth - 21) * len.value : min.value }
function startDrag(e: MouseEvent) {
  if (disable.value || e.button !== 0) return
  state = 'drag'
  curVal.value = getDragCur(e.clientX)
  e.preventDefault()
}
function onDrag(e: MouseEvent) {
  if (state !== 'drag') return
  curVal.value = getDragCur(e.clientX)
}
function endDrag(e: MouseEvent) {
  if (state !== 'drag') return
  curVal.value = getDragCur(e.clientX)
  state = 'slide'
  emit('drag', curVal.value)
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/style';
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
  &:hover>.btn { border-color: $btn-hov-col; }
  &:active>.btn {
    background-color: $trk-use-col;
    &::before { opacity: 1; }
  }
  >.use {
    height: $trk-hei;
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
    height: $btn-wid;
    width: $btn-wid;
    margin: $btn-mar-wid;
    border: $btn-bor-wid solid $trk-use-col;
    border-radius: 50%;
    flex-shrink: 0;
    background-color: transparent;
    // 提示
    &::before {
      @include style.k-tooltip;
      z-index: 1; // 处于顶层
      left: 50%;
      bottom: 28px;
      transform: translate(-50%);
      padding: 0 8px;
      height: $tip-hei;
      line-height: $tip-hei - 3px;
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
