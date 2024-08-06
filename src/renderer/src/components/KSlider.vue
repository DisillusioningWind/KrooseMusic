<template>
  <div class="KSlider" ref="slider" @mousedown.left.prevent="startDrag">
    <div class="Use"></div>
    <div class="Btn" :cur="tooltipFormat(cur)"></div>
    <div class="Unuse"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'KSlider',
  props: {
    min: Number,
    max: Number,
    cur: Number,
    disable: Boolean,
    color: String,
    tooltip: Boolean,
    tooltipFormat: Function,
  },
  emits: [
    'updateCur',//更新当前值
    'dragCur',//拖动当前值
  ],
  setup(props, { emit }) {
    //属性
    let sliderState: 'drag' | 'slide' = 'slide'
    const slider = ref<HTMLElement | null>(null)
    const min = computed(() => props.min || 0)
    const max = computed(() => props.max || 100)
    const disable = computed(() => props.disable || false)
    const color = computed(() => props.color || '#ffffff')
    const tooltip = computed(() => props.tooltip || false)
    const tooltipFormat = computed(() => props.tooltipFormat || ((v: any) => v))
    const len = computed(() => max.value - min.value)
    const cur = ref(props.cur || 0)
    /** 理论占比 */
    const perCur = computed(() => cur.value / len.value)
    /** 实际表现占比 */
    const perUse = computed(() => getPerUse(perCur.value))
    //工具函数
    function getPerUse(perCur: number) {
      return ((slider.value!.offsetWidth - 21) * perCur) / slider.value!.offsetWidth * 100
    }
    function getPerCur(clientX: number) {
      return (clientX - slider.value!.getBoundingClientRect().x - 10.5) / (slider.value!.offsetWidth - 21)
    }
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
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('mousemove', onDrag)
    })
    onUnmounted(() => {
      document.removeEventListener('mouseup', endDrag)
      document.removeEventListener('mousemove', onDrag)
    })
    //内部事件处理
    function startDrag(e: MouseEvent) {
      if (disable.value) return
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
    /** 重置滑块 */
    function reset() {
      cur.value = 0
      sliderState = 'slide'
    }
    return { slider, perUse, color, cur, disable, tooltip, tooltipFormat, startDrag, reset}
  },
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
        visibility: v-bind('tooltip ? "visible" : "hidden"');
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
    // 当前时间提示
    &::before {
      @include tool-tip;
      position: absolute;
      left: -17px;
      bottom: 28px;
      width: 44px;
      height: 27px;
      content: attr(cur);
      font-size: 13px;
      font-weight: 400;
      line-height: 27px;
      text-align: center;
      visibility: hidden;
    }
  }
}
</style>
