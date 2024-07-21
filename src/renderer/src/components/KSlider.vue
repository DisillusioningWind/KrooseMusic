<template>
  <div class="KSlider-Full" ref="slider" @mousedown="startDrag">
    <div class="KSlider-Use"></div>
    <div class="KSlider-Button"></div>
    <div class="KSlider-Left"></div>
  </div>
</template>

<script lang="tsx">
import { defineComponent } from 'vue'

const KSlider = defineComponent({
  name: 'KSlider',
  props: {
    min: Number,
    max: Number,
  },
  setup() {
    const slider = ref()
    let totalHei = ref(21)
    let totalLen = computed(() => slider.value?.offsetWidth)
    let useLen = ref(60)
    let leftLen = computed(() => totalLen.value - useLen.value)
    // let usePer = computed(() => useLen.value / totalLen.value)
    // let leftPer = computed(() => 1 - usePer.value)

    function startDrag(e) {
      console.log('startDrag', e)
    }

    function endDrag(e) {
      console.log('endDrag', e)
    }

    return { slider, totalHei, useLen, leftLen, startDrag, endDrag }
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
    width: v-bind('(useLen - totalHei / 2) + "px"');
    background-color: $track-use-color;
  }
  .KSlider-Left {
    height: $track-height;
    width: v-bind('(leftLen - totalHei / 2) + "px"');
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
