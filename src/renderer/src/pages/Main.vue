<template>
  <div class="Background" :class="showDetail?(musicPicURL?'Picture':'Default'):''">
    <div :class="showDetail?'Blur':''">
      <KTitleBar />
      <div v-show="!showDetail" class="Main">
        <KNavBar />
        <RouterView />
      </div>
      <Detail v-show="showDetail" class="Detail"/>
      <KMusicBar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
const showDetail = computed(() => store.showDetail)
const musicPicURL = computed(() => store.musicPicURL)
</script>

<style scoped lang="scss">
.Background {
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: 100% auto;
  overflow: hidden;
  &.Picture {
    background-image: v-bind('"url(" + musicPicURL + ")"');
  }
  &.Default {
    background-image: linear-gradient(150deg, #3b3b3b, #6b6b6b 20%, #ffffff);
  }
  >div {
    height: 100%;
    width: 100%;
    &.Blur {
      background-color: #0000005f;
      backdrop-filter: blur(40px);
    }
    >.Main {
      height: calc(100% - 152px);
      width: 100%;
      display: flex;
      >div {
        &:last-child {
          width: 0;
          flex: 1;
        }
      }
    }
    >.Detail {
      height: calc(100% - 152px);
      width: 100%;
    }
  }
}
</style>
