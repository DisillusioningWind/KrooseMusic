<template>
  <div class="PMain" :class="showDetail?'Blur':''">
    <KTitleBar />
    <div class="KMainBar">
      <KNavView v-show="!showDetail" />
      <PDetail v-show="showDetail" />
      <KListDrawer v-model="showDrawer" />
    </div>
    <KMusicBar />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
const { showDetail, showDrawer, musicPicURL } = storeToRefs(store)
</script>

<style scoped lang="scss">
.PMain {
  height: 100%;
  width: 100%;
  overflow: hidden;
  &.Blur {
    background-repeat: no-repeat;
    background-position: 50% 0;
    background-size: 100% auto;
    background-image: v-bind('musicPicURL?("url(" + store.musicPicURL + ")"):("linear-gradient(150deg, #3b3b3b, #6b6b6b 20%, #ffffff)")');
    &::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      background-color: #0000005f;
      backdrop-filter: blur(40px);
    }
    >div {
      position: relative;
    }
  }
  >.KMainBar {
    height: calc(100% - 152px);
    width: 100%;
    display: flex;
  }
}
</style>
