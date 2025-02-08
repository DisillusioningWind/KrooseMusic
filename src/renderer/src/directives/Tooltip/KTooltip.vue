<template>
  <div class="KTooltip" ref="tooltip" :class="{ visible: show }" :style="{ left: x + 'px', top: y + 'px' }">{{ text }}</div>
</template>

<script setup lang="ts">
const tooltip = ref<HTMLDivElement>()
const show = ref(false)
const text = ref('')
const x = ref(0)
const y = ref(0)
defineExpose({
  /** 是否显示 */ show,
  /** 提示文本 */ text,
  /** 提示框中心x轴 */ x,
  /** 提示框顶部y轴 */ y
})
// 确定提示框的正确位置
watch(show, show => {
  if (!show) return
  nextTick(() => {
    if (!tooltip.value) return
    const width = tooltip.value.offsetWidth
    const height = tooltip.value.offsetHeight
    x.value = Math.max(0, Math.min(window.innerWidth - width, x.value - width / 2))
    y.value = Math.max(0, y.value - height - 10)
  })
})
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';
$tip-hei: 28px;
.KTooltip {
  @include global.k-tool-tip(fixed);
  z-index: 1;
  height: $tip-hei;
  max-width: 100vw;
  padding: 0 8px;
  pointer-events: none;
  line-height: $tip-hei - 3px;
  white-space: nowrap;
  font-size: 13px;
  opacity: 0;
  transition: opacity .2s;
  &.visible { opacity: 1; }
}
</style>
