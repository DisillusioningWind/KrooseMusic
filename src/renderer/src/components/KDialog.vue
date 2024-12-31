<template>
  <dialog ref="dialog" class="KDialog" :class="show?'show':''">
    <slot></slot>
  </dialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** 是否显示 */
  show: boolean,
  /** 对话框中心位置 */
  center: number
}>()
const dialog = ref<HTMLDialogElement>()

watch(() => props.show, v => {
  // ::backgrop伪元素做背景遮罩，只有showModal调用才会出现；等待关闭动画结束后延时调用close
  if (v) dialog.value?.showModal()
  else setTimeout(() => dialog.value?.close(), 200)
})
</script>

<style scoped lang="scss">
.KDialog {
  position: fixed;
  top: v-bind('center - 2 + "%"');
  left: 50%;
  // round函数消除小数，避免像素模糊，4px是试出来的
  transform: translate(round(-50%, 4px), round(-50%, 4px));
  border: none;
  padding: 0;
  box-shadow: 0 0 20px 0 #00000030;
  opacity: 0;
  transition: all 0.2s;
  &::backdrop {
    background-color: #00000000;
    transition: all 0.2s;
  }
  &.show {
    top: v-bind('center + "%"');
    opacity: 1;
    &::backdrop { background-color: #00000050; }
  }
}
</style>
