<template>
  <div class="KDrawer" ref="drawer" :class="{ show }">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
const show = defineModel<boolean>()
const drawer = ref<HTMLDivElement>()
onMounted(() => { document.addEventListener('click', onDocClick) })
onUnmounted(() => { document.removeEventListener('click', onDocClick) })
function onDocClick(e: MouseEvent) {
  if (!drawer.value || !show.value) return
  show.value = drawer.value.contains(e.target as Node)
}
</script>

<style scoped lang="scss">
.KDrawer {
  z-index: 1;
  position: fixed;
  top: 30px;
  right: 0;
  height: calc(100vh - 152px);
  width: 0;
  background-color: white;
  box-shadow: 0 10px 10px #0000001a;
  transition: width .2s;
  &.show { width: 30%; }
}
</style>
