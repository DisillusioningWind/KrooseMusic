<template>
  <div class="KSlider" ref="slider">
    <div class="use"></div>
    <div class="btn" :cur="tooltipFormat(cur)"></div>
    <div class="unuse"></div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 默认0 */
  min?: number,
  /** 默认100 */
  max?: number,
  /** 当前值 */
  cur: number,
  /** 默认不禁用 */
  disable?: boolean,
  /** 默认不显示提示 */
  tooltip?: boolean,
  /** 默认显示原值 */
  format?: (v: number) => string
}>()
const emit = defineEmits<{ update: [v: number], drag: [v: number] }>()
//属性
let state: 'drag' | 'slide' = 'slide'
const slider = ref<HTMLElement>()
const min = computed(() => props.min || 0)
const max = computed(() => props.max || 100)
const len = computed(() => max.value - min.value) //范围
const cur = ref(props.cur || 0)
const perCur = computed(() => cur.value / len.value) //当前值占范围百分比
const perUse = computed(() => getPerUse(perCur.value)) //已使用进度条占总进度条长度百分比
const disable = computed(() => props.disable) //是否禁用
const tooltip = computed(() => props.tooltip && !props.disable) //是否显示提示
const tooltipFormat = computed(() => props.format || ((v: number) => v)) //提示格式化
/** perCur为1时，实际按钮需要停在距终点按钮自身宽度（21px）的位置，因此进行换算，百分比格式 */
const getPerUse = (perCur: number) => ((slider.value!.offsetWidth - 21) * perCur) / slider.value!.offsetWidth * 100
/** 同理，拖动Slider时perCur的值需要计算按钮的宽度，分数格式 */
const getPerCur = (clientX: number) => (clientX - slider.value!.getBoundingClientRect().x - 10.5) / (slider.value!.offsetWidth - 21)
//监听外部传入的cur，仅当state为slide且新旧值不等时更新内部cur
watch(() => props.cur, (newCur, oldCur) => { if (state === 'slide' && newCur !== oldCur) { cur.value = newCur } })
//限制内部cur范围，通知当前值已改变
watch(cur, (newCur, oldCur) => {
  if (newCur < min.value) { cur.value = min.value }
  else if (newCur > max.value) { cur.value = max.value }
  //如果新旧值相等则不通知，避免死循环
  if (newCur === oldCur) return
  emit('update', cur.value)
})
//事件绑定
onMounted(() => {
  slider.value!.addEventListener('mousedown', startDrag)
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', endDrag)
})
onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', endDrag)
})
//内部事件处理
function startDrag(e: MouseEvent) {
  if (disable.value) return
  if (e.button !== 0) return
  e.preventDefault()
  state = 'drag'
  cur.value = getPerCur(e.clientX) * len.value
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
@import '@renderer/assets/global';
$slider-height: 21px;
$track-height: 2px;
$button-border-width: 3px;
$button-margin-width: 3px;
$button-width: $slider-height - 2 * $button-margin-width;
$button-hover-color: #ffffffa0;
$track-use-color: #ffffffff;
$track-left-color: #ffffff40;

.KSlider {
  height: $slider-height;
  width: 100%;
  flex: 1;
  display: flex;
  align-items: center;
  &:hover { >.btn { border-color: $button-hover-color; } }
  &:active {
    >.btn {
      background-color: $track-use-color;
      &::before {
        opacity: v-bind('tooltip?1:0');
        transition: opacity .2s;
      }
    }
  }
  >.use {
    height: $track-height;
    width: v-bind('perUse+"%"');
    background-color: $track-use-color;
  }
  >.unuse {
    height: $track-height;
    width: 0;
    flex: 1;
    background-color: $track-left-color;
  }
  >.btn {
    position: relative;
    display: v-bind('disable?"none":"block"');
    box-sizing: border-box;
    height: $button-width;
    width: $button-width;
    border: $button-border-width solid $track-use-color;
    border-radius: 50%;
    margin: $button-margin-width;
    background-color: transparent;
    // 提示
    &::before {
      @include k-tool-tip;
      left: 50%;
      bottom: 28px;
      transform: translate(-50%);
      height: 28px;
      line-height: 28px;
      padding: 0 8px;
      content: attr(cur);
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
