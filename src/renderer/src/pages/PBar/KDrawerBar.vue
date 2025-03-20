<template>
  <div class="KDrawerBar" ref="drawer" :class="{ show: showDrawer }">
    <KLibList mode="playlist" :items="curList" :path="curPath" />
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@renderer/store'
import { useLibStore } from '@renderer/store'
const { showDrawer } = storeToRefs(useUIStore())
const { curList, curPath } = storeToRefs(useLibStore())
const drawer = ref<HTMLDivElement>()
onMounted(() => { document.addEventListener('click', onDocClick) })
onUnmounted(() => { document.removeEventListener('click', onDocClick) })
function onDocClick(e: MouseEvent) {
  if (!drawer.value || !showDrawer.value) return
  showDrawer.value = drawer.value.contains(e.target as Node)
}
</script>

<style scoped lang="scss">
.KDrawerBar {
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
