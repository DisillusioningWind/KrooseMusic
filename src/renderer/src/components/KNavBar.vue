<template>
  <div class="KNavBar" :class="expand?'expand':''">
    <div v-for="menu in menus" :key="menu.path" :class="onMenuClass($route.fullPath, menu.path)" @click="onMenuClick(menu.path)">
      <el-icon v-if="menu.path!=='/Search' || !expand"><component :is="menu.icon"></component></el-icon>
      <span v-if="menu.path!=='/Search' || !expand">{{ menu.title }}</span>
      <div v-if="menu.path==='/Search' && expand"><input v-model="search" type="text" placeholder="搜索" spellcheck="false"/></div>
      <div v-if="menu.path==='/Search' && expand && search.length > 0" @click="onCloseClick"><SVGClose /></div>
      <div v-if="menu.path==='/Search' && expand" @click="onSearchClick"><SVGSearch /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import router from '@renderer/router'
import SVGMax from '@renderer/assets/icons/max.svg?component'
import SVGSearch from '@renderer/assets/icons/search.svg?component'
import SVGClose from '@renderer/assets/icons/close.svg?component'
import SVGMusic from '@renderer/assets/icons/music.svg?component'
import SVGLike from '@renderer/assets/icons/like.svg?component'
import SVGPlayList from '@renderer/assets/icons/playList.svg?component'
import SVGSetting from '@renderer/assets/icons/setting.svg?component'
const store = useStore()
const expand = ref(false)
const search = ref('')
const menus = [
  { path: '/Max', title: '', icon: SVGMax },
  { path: '/Search', title: '', icon: SVGSearch},
  { path: '/Library', title: '音乐库', icon: SVGMusic },
  { path: '/Like', title: '收藏', icon: SVGLike },
  { path: '/List', title: '播放列表', icon: SVGPlayList },
  { path: '/Setting', title: '设置', icon: SVGSetting }
]
watch(expand, v => store.navExpand = v)
function onMenuClass(routePath: string, menuPath: string) {
  if (routePath === menuPath && routePath !== '/Search') {
    return 'select'
  } else if (menuPath === '/Search' && expand.value) {
    return 'search'
  } else {
    return ''
  }
}
function onMenuClick(path: string) {
  if (path === '/Max') {
    expand.value = !expand.value
  } else if (path === '/Search') {
    if (!expand.value) {
      expand.value = true
    }
  } else {
    router.push(path)
  }
}
function onCloseClick() {
  search.value = ''
}
function onSearchClick() {
  if (search.value.length > 0) {
    router.push('/Search')
  }
}
</script>

<style scoped lang="scss">
$border-width: 4px;
$left-len: 6px;
@mixin cutline {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: $left-len;
    height: 1px;
    width: calc(100% - 2 * $left-len - $border-width);
    background-color: #d6d6d6;
    visibility: v-bind('expand? "visible": "hidden"');
  }
}
.KNavBar {
  height: 100%;
  width: 48px;
  background-color: #f2f2f2;
  border: none;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: width .15s;
  &.expand {
    width: 200px;
    transition: width .15s;
  }
  >div {
    height: 50px;
    width: 100%;
    padding: 0;
    border-left: $border-width solid transparent;
    box-sizing: border-box;
    color: #000000;
    display: flex;
    align-items: center;
    &:hover {
      background-color: #dadada;
    }
    &:active {
      background-color: #c2c2c2;
    }
    &:last-child {
      margin-top: auto;
      @include cutline;
    }
    &:first-child {
      @include cutline;
    }
    &.select {
      border-left: 4px solid #005a9e;
    }
    >.el-icon {
      width: 40px;
      margin-right: $border-width;
      flex-shrink: 0;
      svg {
        height: 18px;
        width: 18px;
      }
    }
    >span {
      white-space: nowrap;
      user-select: none;
    }
    &.search {
      user-select: none;
      &:hover {
        background-color: #f2f2f2;
      }
      &:active {
        background-color: #f2f2f2;
      }
      >div:first-child {
        height: 65%;
        flex: 1;
        display: flex;
        align-items: center;
        margin-left: 6px;
        >input {
          height: 100%;
          width: 100%;
          box-sizing: border-box;
          border: 0;
          outline: 0;
          padding: 0;
          padding-left: 8px;
          background-color: #fafafa;
          font-size: 15px;
        }
      }
      >div:not(:first-child) {
        height: 65%;
        width: 30px;
        box-sizing: border-box;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fafafa;
        svg {
          height: 60%;
          width: 50%;
        }
        &:hover {
          svg { fill: #0078d7; }
        }
        &:active {
          background-color: #0078d7;
          svg { fill: #fff; }
        }
      }
      >div:last-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
