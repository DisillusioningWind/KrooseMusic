<template>
  <el-menu mode="vertical" default-active="" router collapse>
    <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
      <el-icon><component :is="menu.icon"></component></el-icon>
      <span>{{ menu.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">

const menus = [
  { path: '/Search', title: 'Search', icon: 'Search'},
  { path: '/Library', title: 'Library', icon: 'Service' },
  { path: '/Like', title: 'Like', icon: 'Star' },
  { path: '/List', title: 'List', icon: 'Collection' },
  { path: '/Setting', title: 'Setting', icon: 'Setting' }
]

let menuWidth = 50
let menuWidthStyle = computed(() => `${menuWidth}px`)
defineExpose({ menuWidthStyle })
</script>

<style scoped lang="scss">
.red {
  color: red;
}
.el-menu {
  height: 100%;
  width: v-bind('menuWidthStyle');
  background-color: #f2f2f2;
  display: flex;
  flex-direction: column;
  .el-menu-item {
    padding: 0;
    height: 50px;
    width: v-bind('menuWidthStyle');
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    &:hover {
      background-color: #dadada;
    }
    &:focus {
      border-left: 4px solid #00599c;
    }
    &:last-child {
      margin-top: auto;
    }
    .el-icon {
      margin: auto;
    }
  }
}
</style>
