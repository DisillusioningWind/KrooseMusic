<template>
  <div class="KSlider-Full" ref="slider" @mousedown.left.prevent="startDrag">
    <div class="KSlider-Use"></div>
    <div class="KSlider-Button"></div>
    <div class="KSlider-Left"></div>
  </div>
</template>

<script lang="tsx">
import emitter from '@renderer/utils/emitter'
import { defineComponent } from 'vue'
const KSlider = defineComponent({
  name: 'KSlider',
  props: {
    disable: Boolean,
    min: Number,
    max: Number,
    cur: Number,
  },
  setup(props) {
    const slider = ref()
    let sliderState: 'drag' | 'slide' = 'slide'
    let min = computed(() => props.min || 0)
    let max = computed(() => props.max || 100)
    let cur = ref(0)
    let len = computed(() => max.value - min.value)
    let perUse = computed(() => cur.value / len.value * 100)
    let perUnuse = computed(() => 100 - perUse.value)
    //工具函数
    function getPerUseWhenDrag(clientX: number) {
      return (clientX - slider.value.getBoundingClientRect().x) / slider.value.offsetWidth
    }
    //监听
    watch(() => props.cur, (newCur) => {
      if (sliderState === 'slide') {
        cur.value = newCur || 0
      }
    })
    //事件绑定
    onMounted(() => {
      document.addEventListener('mouseup', endDrag)
      document.addEventListener('mousemove', onDrag)
      emitter.on('sliderReset', reset)
    })
    //事件处理
    function startDrag(e: MouseEvent) {
      if (props.disable) return
      sliderState = 'drag'
      cur.value = getPerUseWhenDrag(e.clientX) * len.value
      console.log('startDrag', cur.value)
    }
    function onDrag(e: MouseEvent) {
      if (sliderState === 'drag') {
        cur.value = getPerUseWhenDrag(e.clientX) * len.value
      }
    }
    function endDrag(e: MouseEvent) {
      if (sliderState === 'drag') {
        cur.value = getPerUseWhenDrag(e.clientX) * len.value
        sliderState = 'slide'
        emitter.emit('sliderChangeTime', cur.value)
      }
    }
    function reset() {
      cur.value = 0
      sliderState = 'slide'
    }
    return { slider, perUse, perUnuse, startDrag }
  },
})
export default KSlider

export function autopreviewKSlider() {
  return <KSlider />
}
</script>

<style scoped lang="scss">
$slider-height: 21px;
$track-height: 2px;
$button-border-width: 3px;
$button-margin-width: 3px;
$button-hover-color: #ffffffa0;
$track-use-color: #ffffffff;
$track-left-color: #ffffff40;
.KSlider-Full {
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
    }
  }
  .KSlider-Use {
    height: $track-height;
    width: v-bind('perUse + "%"');
    background-color: $track-use-color;
  }
  .KSlider-Left {
    height: $track-height;
    width: v-bind('perUnuse + "%"');
    background-color: $track-left-color;
  }
  .KSlider-Button {
    box-sizing: border-box;
    height: $slider-height - 2 * $button-margin-width;
    width: $slider-height - 2 * $button-margin-width;
    border: $button-border-width solid $track-use-color;
    border-radius: 50%;
    margin: $button-margin-width;
    background-color: transparent;
  }
}
</style>
