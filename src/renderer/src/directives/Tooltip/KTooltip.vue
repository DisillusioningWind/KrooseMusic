<template>
  <div class="KTooltip" ref="tooltip" :class="show?'visible':''">
    <span>{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const tooltip = ref<HTMLElement>()
const show = ref(false)
const text = ref('')
const x = ref(0)
const y = ref(0)
watch(show, v => {
  if (!v) return
  nextTick(() => {
    if (!tooltip.value) return
    const width = tooltip.value.offsetWidth
    const height = tooltip.value.offsetHeight
    x.value -= width / 2
    y.value -= height + 10
    if (x.value < 0) x.value = 0
    else if (x.value + width > window.innerWidth) x.value = window.innerWidth - width
  })
})
defineExpose({ show, text, x, y })
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';
$tooltip-height: 26px;

.KTooltip {
  @include global.k-tool-tip(fixed);
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  z-index: 1;
  height: $tooltip-height;
  padding: 0 8px;
  opacity: 0;
  transition: opacity .2s;
  pointer-events: none;
  &.visible {
    opacity: 1;
    transition: opacity .2s;
  }
  >span {
    line-height: $tooltip-height;
    white-space: nowrap;
    font-size: 13px;
  }
}
</style>
