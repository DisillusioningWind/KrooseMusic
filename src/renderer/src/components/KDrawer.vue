<template>
  <div class="KDrawer" ref="drawer" :class="show?'show':''">

  </div>
</template>

<script setup lang="ts">
const show = defineModel<boolean>({ default: false })
const drawer = ref<HTMLElement>()
onMounted(() => {
  document.addEventListener('click', () => {
    if (show.value) {
      show.value = false
    }
  })
})
</script>

<style scoped lang="scss">
.KDrawer {
  position: fixed;
  z-index: 1;
  top: 0;
  right: 0;
  height: 100%;
  width: 0;
  background-color: white;
  transition: width .2s;
  &.show {
    width: 30%;
    transition: width .2s;
  }
}
</style>
