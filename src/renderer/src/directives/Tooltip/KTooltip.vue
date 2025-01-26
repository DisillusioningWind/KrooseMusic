<template>
  <div class="KTooltip" ref="tooltip" :class="{ visible: show }">
    <span class="text">{{ text }}</span>
  </div>
</template>

<script setup lang="ts">
const tooltip = ref<HTMLDivElement>()
const show = ref(false)
const text = ref('')
const x = ref(0)
const y = ref(0)
defineExpose({
  /** 是否显示提示 */
  show,
  /** 提示文本 */
  text,
  /** 提示框x轴中心点 */
  x,
  /** 提示框y轴顶点 */
  y
})
watch(show, show => {
  if (!show) return
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
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';
$tooltip-height: 26px;

.KTooltip {
  @include global.k-tool-tip(fixed);
  z-index: 1;
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  height: $tooltip-height;
  padding: 0 8px;
  opacity: 0;
  transition: opacity .2s;
  pointer-events: none;
  &.visible { opacity: 1; }
  >.text {
    line-height: $tooltip-height;
    font-size: 13px;
    white-space: nowrap;
  }
}
</style>
