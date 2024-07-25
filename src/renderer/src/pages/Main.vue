<template>
  <el-container>
    <el-header>
      <div class="TitleBar"></div>
    </el-header>
    <el-container v-show="!showDetailCom">
      <el-aside><MainNav ref="nav"/></el-aside>
      <el-main><router-view /></el-main>
    </el-container>
    <el-container v-show="showDetailCom">
      <Detail />
    </el-container>
    <el-footer><MusicPlayer/></el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import { ElHeader } from 'element-plus';
let nav = ref()
let store = useStore()
let showDetailCom = computed(() => store.showDetail)
let menuWidthStyle = computed(() => nav.value.menuWidthStyle)
</script>

<style scoped lang="scss">
.TitleBar {
  height: 100%;
  width: 100%;
  background-color: #f2f2f2;
  -webkit-app-region: drag;
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
    height: 122px;
    padding: 0px;
  }
}
</style>
