<template>
  <div class="KSlider" ref="slider">
    <div class="Use"></div>
    <div class="Btn" :cur="tooltipFormat(cur)"></div>
    <div class="Unuse"></div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    min: Number,
    max: Number,
    cur: Number,
    disable: Boolean,
    tooltip: Boolean,
    tooltipFormat: Function
  },
  emits: [
    'updateCur', //更新当前值
    'dragCur' //拖动当前值
  ],
  setup(props, { emit }) {
    //属性
    let sliderState: 'drag' | 'slide' = 'slide'
    const slider = ref<HTMLElement | null>(null)
    const min = computed(() => props.min || 0)
    const max = computed(() => props.max || 100)
    const len = computed(() => max.value - min.value) //范围
    const cur = ref(props.cur || 0)
    const perCur = computed(() => cur.value / len.value) //当前值占范围百分比
    const perUse = computed(() => getPerUse(perCur.value)) //已使用进度条占总进度条长度百分比
    const disable = computed(() => props.disable || false) //是否禁用
    const tooltip = computed(() => props.tooltip || false) //是否显示提示
    const tooltipFormat = computed(() => props.tooltipFormat || ((v: any) => v)) //提示格式化
    /** perCur为1时，实际按钮需要停在距终点按钮自身宽度（21px）的位置，因此进行换算 */
    const getPerUse = (perCur: number) => ((slider.value!.offsetWidth - 21) * perCur) / slider.value!.offsetWidth * 100
    /** 同理，拖动Slider时perCur的值需要计算按钮的宽度 */
    const getPerCur = (clientX: number) => (clientX - slider.value!.getBoundingClientRect().x - 10.5) / (slider.value!.offsetWidth - 21)
    //监听外部传入的cur，仅当sliderState为slide且新旧值不等时更新内部cur
    watch(() => props.cur, (newCur, oldCur) => {
      if (sliderState === 'slide' && newCur !== oldCur) {
        cur.value = newCur || 0
      }
    })
    //限制内部cur范围，通知当前值已改变
    watch(cur, (newCur, oldCur) => {
      if (newCur < min.value) {
        cur.value = min.value
      } else if (newCur > max.value) {
        cur.value = max.value
      }
      //如果新旧值相等则不通知，避免死循环
      if (newCur === oldCur) return
      emit('updateCur', cur.value)
    })
    //事件绑定
    onMounted(() => {
      slider.value!.addEventListener('mousedown', startDrag)
      document.addEventListener('mousemove', onDrag)
      document.addEventListener('mouseup', endDrag)
    })
    onUnmounted(() => {
      slider.value?.removeEventListener('mousedown', startDrag)
      document.removeEventListener('mousemove', onDrag)
      document.removeEventListener('mouseup', endDrag)
    })
    //内部事件处理
    function startDrag(e: MouseEvent) {
      if (disable.value) return
      if (e.button !== 0) return
      e.preventDefault()
      sliderState = 'drag'
      cur.value = getPerCur(e.clientX) * len.value
    }
    function onDrag(e: MouseEvent) {
      if (sliderState !== 'drag') return
      cur.value = getPerCur(e.clientX) * len.value
    }
    function endDrag(e: MouseEvent) {
      if (sliderState !== 'drag') return
      cur.value = getPerCur(e.clientX) * len.value
      sliderState = 'slide'
      emit('dragCur', cur.value)
    }
    return { slider, perUse, cur, disable, tooltip, tooltipFormat }
  }
})
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
  &:hover {
    .Btn {
      border-color: $button-hover-color;
    }
  }
  &:active {
    .Btn {
      background-color: $track-use-color;
      &::before {
        opacity: v-bind('tooltip ? 1 : 0');
        transition: opacity .2s;
      }
    }
  }
  .Use {
    height: $track-height;
    width: v-bind('perUse + "%"');
    background-color: $track-use-color;
  }
  .Unuse {
    height: $track-height;
    flex-grow: 1;
    background-color: $track-left-color;
  }
  .Btn {
    position: relative;
    display: v-bind('disable ? "none" : "block"');
    box-sizing: border-box;
    height: $button-width;
    width: $button-width;
    border: $button-border-width solid $track-use-color;
    border-radius: 50%;
    margin: $button-margin-width;
    background-color: transparent;
    // 提示
    &::before {
      @include tool-tip;
      position: absolute;
      left: 50%;
      transform: translate(-50%);
      bottom: 28px;
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
