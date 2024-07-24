<template>
  <div class="KSlider-Wrapper">
    <div class="KSlider-Left"></div>
    <div class="KSlider-Track" ref="slider" @mousedown.left.prevent="startDrag">
      <div class="KSlider-Use"></div>
      <div class="KSlider-Button" :cur="formatTime(cur, 'mm:ss')"></div>
      <div class="KSlider-Unuse"></div>
    </div>
    <div class="KSlider-Right"></div>
  </div>
</template>

<script lang="tsx">
import { emitter, events } from '@renderer/utils/emitter'
import { formatTime } from '@renderer/utils/tools'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'KSlider',
  props: {
    min: Number,
    max: Number,
    cur: Number,
    disable: Boolean,
    color: String,
  },
  setup(props) {
    //属性
    const slider = ref()
    let sliderState: 'drag' | 'slide' = 'slide'
    let min = computed(() => props.min || 0)
    let max = computed(() => props.max || 100)
    let len = computed(() => max.value - min.value)
    let cur = ref(0)
    let perUse = computed(() => cur.value / len.value * 100)
    let color = computed(() => props.color || '#ffffff')
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
      emitter.emit(events.sliderShowCur, cur.value)
    })
    //事件绑定
    onMounted(() => {
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('mousemove', onDrag)
      emitter.on(events.sliderReset, reset)
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
      emitter.emit(events.sliderDragCur, cur.value)
    }
    //外部事件处理
    function reset() {
      cur.value = 0
      sliderState = 'slide'
    }
    return { slider, perUse, color, cur, startDrag, formatTime }
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

.KSlider-Wrapper {
  height: $slider-height;
  width: 100%;
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
          visibility: visible;
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
