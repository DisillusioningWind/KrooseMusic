<template>
  <el-container class="BackCon" :style="{ backgroundImage : showDetailCom ? `url(${ showDetailPicUrl })` : '' }">
  <el-container :class=" showDetailCom ? 'TopCon' : ''">
    <el-header><KTitleBar /></el-header>
    <el-container v-show="!showDetailCom">
      <el-aside><MainNav ref="nav"/></el-aside>
      <el-main><router-view /></el-main>
    </el-container>
    <el-container v-show="showDetailCom"><Detail /></el-container>
    <el-footer><KMusicBar /></el-footer>
  </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const nav = ref()
const store = useStore()
const showDetailCom = computed(() => store.showDetail)
const showDetailPicUrl = computed(() => store.detailPicUrl)
const menuWidthStyle = computed(() => nav.value.menuWidthStyle)
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
}
.el-container {
  height: 100%;
  .el-header {
    padding: 0px;
    height: 30px;
  }
  .el-aside {
    background-color: #f2f2f2;
    width: v-bind('menuWidthStyle');
  }
  .el-footer {
    padding: 0px;
    height: 122px;
  }
}
</style>
