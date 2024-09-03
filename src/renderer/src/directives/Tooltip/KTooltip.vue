<template>
  <div ref="kTooltip" class="KTooltip" :class="show ? 'visible' : ''">
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const kTooltip = ref<HTMLElement | null>(null)
    const text = ref('')
    const show = ref(false)
    const top = ref(0)
    const left = ref(0)
    watch(show,async (v) => {
      if (!v) return
      await nextTick()
      const tooltip = kTooltip.value
      if (!tooltip) return
      const width = tooltip.offsetWidth
      const height = tooltip.offsetHeight
      left.value -= width / 2
      top.value -= height + 10
      if (left.value < 0) left.value = 0
      else if (left.value + width > window.innerWidth) left.value = window.innerWidth - width
    })
    return { kTooltip, text, show, top, left }
  }
})
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';
$tooltip-height: 26px;
.KTooltip {
  position: fixed;
  top: v-bind('top + "px"');
  left: v-bind('left + "px"');
  height: $tooltip-height;
  z-index: 1;
  @include tool-tip;
  padding: 0 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
  &.visible {
    opacity: 1;
    transition: opacity .2s;
  }
  span {
    line-height: $tooltip-height;
    white-space: nowrap;
    font-size: 13px;
  }
}
</style>
