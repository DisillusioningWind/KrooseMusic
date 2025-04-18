<template>
  <div class="KNavBar" :class="{ expand }">
    <div class="nav" v-for="menu in menus" :key="menu.path" :class="onMenuClass($route.fullPath, menu.path)" @click="onMenuClick(menu.path)">
      <component class="icon" v-if="menu.path!=='/Search' || !expand" :is="menu.icon" />
      <span class="title" v-if="menu.title.length > 0">{{ menu.title }}</span>
      <input class="input" v-if="menu.path==='/Search' && expand" v-model="search" type="text" placeholder="搜索" spellcheck="false" />
      <div class="cancel" v-if="menu.path==='/Search' && expand && search.length > 0" @click="onCancelClick"><SVGClose /></div>
      <div class="confirm" v-if="menu.path==='/Search' && expand" @click="onSearchClick"><SVGSearch /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@renderer/store'
import router from '@renderer/router'
import SVGMax from '@renderer/assets/icons/max.svg?component'
import SVGSearch from '@renderer/assets/icons/search.svg?component'
import SVGClose from '@renderer/assets/icons/close.svg?component'
import SVGMusic from '@renderer/assets/icons/music.svg?component'
import SVGLike from '@renderer/assets/icons/like.svg?component'
import SVGPlayList from '@renderer/assets/icons/playList.svg?component'
import SVGSetting from '@renderer/assets/icons/setting.svg?component'
const { navExpand: expand } = storeToRefs(useUIStore())
const search = ref('')
const menus = [
  { path: '/Max', title: '', icon: SVGMax },
  { path: '/Search', title: '', icon: SVGSearch},
  { path: '/Library', title: '音乐库', icon: SVGMusic },
  { path: '/Like', title: '收藏', icon: SVGLike },
  { path: '/List', title: '播放列表', icon: SVGPlayList },
  { path: '/Setting', title: '设置', icon: SVGSetting }
]
onMounted(() => { onMenuClick('/Library') }) // 默认路径
function onMenuClass(routePath: string, menuPath: string) {
  if (menuPath !== '/Search' && menuPath === routePath) { return 'select' }
  else if (menuPath === '/Search' && expand.value) { return 'search' }
  else { return '' }
}
function onMenuClick(path: string) {
  if (path === '/Max') { expand.value = !expand.value }
  else if (path !== '/Search') { router.push(path) }
  else if (path === '/Search' && !expand.value) { expand.value = true }
}
function onCancelClick() { search.value = '' }
function onSearchClick() { if (search.value.length > 0) { router.push({ path: '/Search', query: { search: search.value } }) } }
</script>

<style scoped lang="scss">
$sel-wid: 4px;
$pad-left: 6px;
@mixin k-search-btn {
  height: 65%;
  background-color: #fafafa;
}

.KNavBar {
  height: 100%;
  width: 48px;
  background-color: #f2f2f2;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: width .15s;
  &.expand {
    width: 200px;
    >.nav:last-child::before { visibility: visible; }
  }
  >.nav {
    height: 50px;
    width: 100%;
    border-left: $sel-wid solid transparent;
    user-select: none;
    display: flex;
    align-items: center;
    &:not(.search):hover { background-color: #dadada; }
    &:not(.search):active { background-color: #c2c2c2; }
    &.select { border-left: $sel-wid solid #005a9e; }
    >.icon {
      height: 18px;
      width: 18px;
      margin: 11px;
      margin-right: 11px + $sel-wid;
      flex-shrink: 0;
    }
    >.title { white-space: nowrap; }
    // 设置
    &:last-child {
      margin-top: auto;
      position: relative;
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: $pad-left;
        height: 1px;
        width: calc(100% - 2 * $pad-left - $sel-wid);
        background-color: #d6d6d6;
        visibility: hidden;
      }
    }
    // 搜索
    &.search {
      padding: 0 10px 0 $pad-left;
      >.input {
        @include k-search-btn;
        width: 0;
        flex: 1;
        border: 0;
        outline: 0;
        padding: 0 0 0 8px;
        font-size: 15px;
      }
      >.confirm {
        @include k-search-btn;
        width: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover { --svg-col: #0078d7; }
        &:active {
          --svg-col: #fff;
          background-color: #0078d7;
        }
        >svg {
          height: 60%;
          width: 50%;
          fill: var(--svg-col, #000);
        }
      }
      >.cancel {
        @extend .confirm;
        >svg { width: 60%; }
      }
    }
  }
}
</style>
