<template>
  <el-menu mode="vertical" default-active="/Library" :collapse="collapsed" :collapse-transition="false" @select="onSelect">
    <el-menu-item v-for="menu in menus" :key="menu.path" :index="menu.path">
      <el-icon><component :is="menu.icon"></component></el-icon>
      <span>{{ menu.title }}</span>
    </el-menu-item>
  </el-menu>
</template>

<script setup lang="ts">
import router from '@renderer/router'
const menus = [
  { path: '/Max', title: '', icon: 'Coin' },
  { path: '/Search', title: '搜索', icon: 'Search'},
  { path: '/Library', title: '音乐库', icon: 'Service' },
  { path: '/Like', title: '收藏', icon: 'Star' },
  { path: '/List', title: '播放列表', icon: 'Collection' },
  { path: '/Setting', title: '设置', icon: 'Setting' }
]
const collapsed = ref(false)
const menuWidth = computed(() => collapsed.value ? 48 : 120)
function onSelect(index: string) {
  if (index === '/Max') {
    collapsed.value = !collapsed.value
  } else {
    router.push(index)
  }
}
</script>

<style scoped lang="scss">
.el-menu {
  height: 100%;
  width: v-bind('menuWidth + "px"');
  background-color: #f2f2f2;
  border: none;
  display: flex;
  flex-direction: column;
  .el-menu-item {
    height: 50px;
    width: 100%;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    padding: 0 !important;
    color: #000000;
    &:hover {
      background-color: #dadada;
    }
    &:active {
      background-color: #c2c2c2;
    }
    &:focus {
      border-left: 4px solid #00599c;
    }
    &:last-child {
      margin-top: auto;
      border-top-width: 1px;
      border-top-style: solid;
      border-top-color: v-bind('collapsed ? "transparent" : "#d6d6d6"');
    }
    .el-icon {
      width: 40px;
    }
  }
}
</style>
