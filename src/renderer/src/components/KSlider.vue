<template>
  <div class="KSlider">
    <div class="KSlider-Left"></div>
    <div class="KSlider-Track" ref="slider" @mousedown.left.prevent="startDrag">
      <div class="KSlider-Use"></div>
      <div class="KSlider-Button" :cur="tooltipFormat(cur)"></div>
      <div class="KSlider-Unuse"></div>
    </div>
    <div class="KSlider-Right"></div>
  </div>
</template>

<script lang="tsx">
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
    const slider = ref()
    const min = computed(() => props.min || 0)
    const max = computed(() => props.max || 100)
    const color = computed(() => props.color || '#ffffff')
    const tooltip = computed(() => props.tooltip || false)
    const tooltipFormat = computed(() => props.tooltipFormat || ((v: any) => v))
    const len = computed(() => max.value - min.value)
    const cur = ref(props.cur || 0)
    const perUse = computed(() => cur.value / len.value * 100)
    //工具函数
    function getPerUseWhenDrag(clientX: number) {
      return (clientX - slider.value.getBoundingClientRect().x) / slider.value.offsetWidth
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
      if (props.disable) return
      sliderState = 'drag'
      cur.value = getPerUseWhenDrag(e.clientX) * len.value
    }
    function onDrag(e: MouseEvent) {
      if (sliderState !== 'drag') return
      cur.value = getPerUseWhenDrag(e.clientX) * len.value
    }
    function endDrag(e: MouseEvent) {
      if (sliderState !== 'drag') return
      cur.value = getPerUseWhenDrag(e.clientX) * len.value
      sliderState = 'slide'
      emit('dragCur', cur.value)
    }
    /** 重置滑块 */
    function reset() {
      cur.value = 0
      sliderState = 'slide'
    }
    return { slider, perUse, color, cur, startDrag, reset, tooltip, tooltipFormat}
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
  .KSlider-Left {
    height: $track-height;
    width: calc($slider-height / 2);
    background-color: $track-use-color;
  }
  .KSlider-Right {
    height: $track-height;
    width: calc($slider-height / 2);
    background-color: $track-left-color;
  }
  .KSlider-Track {
    position: relative;
    height: $slider-height;
    width: 100%;
    display: flex;
    align-items: center;
    &:hover {
      .KSlider-Button {
        border-color: $button-hover-color;
      }
    }
    &:active {
      .KSlider-Button {
        background-color: $track-use-color;
        &::before {
          visibility: v-bind('tooltip ? "visible" : "hidden"');
        }
      }
    }
    .KSlider-Use {
      height: $track-height;
      width: v-bind('perUse + "%"');
      background-color: $track-use-color;
    }
    .KSlider-Unuse {
      height: $track-height;
      flex-grow: 1;
      background-color: $track-left-color;
    }
    .KSlider-Button {
      box-sizing: border-box;
      position: absolute;
      z-index: 1;
      left: v-bind('perUse + "%"');
      height: $button-width;
      width: $button-width;
      transform: translateX(calc($slider-height / -2));
      border: $button-border-width solid $track-use-color;
      border-radius: 50%;
      margin: $button-margin-width;
      background-color: transparent;
      // 当前时间提示
      &::before {
        @include tool-tip;
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
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: v-bind('perUse + "%"');
      height: $slider-height;
      width: $slider-height;
      transform: translateX(calc($slider-height / -2));
      background-color: v-bind('color');
    }
  }
}
</style>
