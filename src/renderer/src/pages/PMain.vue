<template>
  <div class="PMain" :class="store.showDetail?(store.musicPicURL?'Picture':'Default'):''">
    <div class="Container" :class="store.showDetail?'Blur':''">
      <KTitleBar />
      <div class="KMainBar">
        <KNavView v-show="!store.showDetail" />
        <PDetail v-show="store.showDetail" />
        <KListDrawer v-model="store.showDrawer" />
      </div>
      <KMusicBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
</script>

<style scoped lang="scss">
.PMain {
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: 100% auto;
  overflow: hidden;
  &.Picture {
    background-image: v-bind('"url(" + store.musicPicURL + ")"');
  }
  &.Default {
    background-image: linear-gradient(150deg, #3b3b3b, #6b6b6b 20%, #ffffff);
  }
  >.Container {
    height: 100%;
    width: 100%;
    &.Blur {
      background-color: #0000005f;
      backdrop-filter: blur(40px);
    }
    >.KMainBar {
      height: calc(100% - 152px);
      width: 100%;
      display: flex;
    }
  }
}
</style>
