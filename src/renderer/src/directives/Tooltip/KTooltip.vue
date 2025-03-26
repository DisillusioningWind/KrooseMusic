<template>
  <div class="KTooltip" ref="tooltip" :class="{ visible: show }" :style="{ left: posx + 'px', top: posy + 'px' }">{{ text }}</div>
</template>

<script setup lang="ts">
import bus from '@renderer/utils/emitter'
const tooltip = ref<HTMLDivElement>()
const show = ref(false)// 是否显示
const text = ref('')   // 提示文本
const posx = ref(0)    // 提示框中心x轴
const posy = ref(0)    // 提示框顶部y轴
// 改变提示框状态，只有状态为显示时才更改文本和位置
// 传入的cx为提示框附着组件的中心x轴，cy为附着组件的顶部y轴，所以需要根据提示框的宽度进行位置转换，同时限制提示框不超过窗口显示范围
bus.onChangeTooltipState((cs: boolean, ct?: string, cx?: number, cy?: number) => {
  show.value = cs
  if (!cs) return
  if (ct) text.value = ct
  if (cx) posx.value = cx
  if (cy) posy.value = cy
  nextTick(() => {
    if (!tooltip.value) return
    const width = tooltip.value.offsetWidth
    const height = tooltip.value.offsetHeight
    posx.value = Math.max(0, Math.min(window.innerWidth - width, posx.value - width / 2))
    posy.value = Math.max(0, posy.value - height - 10)
  })
})
</script>

<style scoped lang="scss">
@use '@renderer/assets/style' as *;
$tip-hei: 28px;
.KTooltip {
  @include k-tooltip(fixed);
  z-index: 1;
  height: $tip-hei;
  max-width: 100vw;
  padding: 0 8px;
  pointer-events: none;
  line-height: $tip-hei - 3px;// 减去border宽度1.5px
  white-space: nowrap;
  font-size: 13px;
  opacity: 0;
  transition: opacity .2s;
  &.visible { opacity: 1; }
}
</style>
