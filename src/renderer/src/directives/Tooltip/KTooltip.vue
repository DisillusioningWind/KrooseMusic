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
  /** 是否显示提示 */ show,
  /** 提示文本 */ text,
  /** 提示框中心x轴 */ x,
  /** 提示框顶部y轴 */ y
})
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
$tip-hei: 26px;
.KTooltip {
  @include global.k-tool-tip(fixed);
  z-index: 1;
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  height: $tip-hei;
  max-width: 100vw;
  padding: 0 8px;
  pointer-events: none;
  opacity: 0;
  transition: opacity .2s;
  &.visible { opacity: 1; }
  >.text {
    line-height: $tip-hei;
    font-size: 13px;
    white-space: nowrap;
  }
}
</style>
