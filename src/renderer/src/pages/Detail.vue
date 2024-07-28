<template>
  <div class="Detail-Wrapper">
    <div class="Detail-Container">
      <div class="Detail-PicDiv"><img class="Detail-Pic" :src="detailPicUrl" /></div>
      <div class="Detail-LrcDiv"><KLyric /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
const detailPicUrl = computed(() => store.detailPicUrl)


</script>

<style scoped lang="scss">
.Detail-Wrapper {
  height: 100%;
  width: 100%;
  .Detail-Container {
    height: 100%;
    width: 100%;
    display: flex;
    .Detail-PicDiv {
      width: 27%;
      padding: 12px;
      max-width: 300px;
      display: flex;
      .Detail-Pic {
        width: 100%;
        align-self: flex-end;
      }
    }
    .Detail-LrcDiv {
      width: 73%;
      padding-bottom: 12px;
    }
  }
}
</style>
