<template>
  <el-container class="BackCon" :style="{ backgroundImage : showDetailCom ? `url(${ backPicURL })` : '' }">
    <el-container :class=" showDetailCom ? ( backPicURL == defaultPicURL ? '' : 'TopCon') : ''">
      <el-header><KTitleBar /></el-header>
      <el-container class="MainCon" v-show="!showDetailCom">
        <el-aside><KNavBar /></el-aside>
        <el-main><router-view /></el-main>
      </el-container>
      <el-container v-show="showDetailCom">
        <Detail />
      </el-container>
      <el-footer><KMusicBar /></el-footer>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import defaultPicURL from '@renderer/assets/DefaultPic.jpg'
const store = useStore()
const showDetailCom = computed(() => store.showDetail)
const backPicURL = computed(() => store.musicPicURL ? store.musicPicURL : defaultPicURL)
</script>

<style scoped lang="scss">
.BackCon {
  background-repeat: no-repeat;
  background-position: 50% 0;
  background-size: 100% auto;
  .TopCon {
    background-color: #0000005f;
    backdrop-filter: blur(40px);
  }
  .MainCon {
    height: calc(100% - 152px);
  }
}
.el-container {
  height: 100%;
  .el-header {
    padding: 0px;
    height: 30px;
  }
  .el-aside {
    background-color: #f2f2f2;
    width: fit-content;
  }
  .el-main {
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .el-footer {
    padding: 0px;
    height: 122px;
  }
}
</style>
