<template>
  <div class="KMenu" ref="menu" :class="{ show }" :style="{ left: posx + 'px', top: posy + 'px' }">
    <div class="item" v-for="item in items" :key="item.label" @click="onClick(item)">
      <component class="icon" v-if="item.icon" :is="item.icon" />
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import bus from '@renderer/utils/emitter'
const menu = ref<HTMLDivElement>()
const show = ref(false)
const posx = ref(0)
const posy = ref(0)
const items = shallowRef<IMenuItem[]>([])
onMounted(() => {
  document.addEventListener('click', onCloseMenu, true)
  document.addEventListener('contextmenu', onCloseMenu, true)
  bus.onChangeMenuState(onOpenMenu)
})
onUnmounted(() => {
  document.removeEventListener('click', onCloseMenu, true)
  document.removeEventListener('contextmenu', onCloseMenu, true)
})
// 根据鼠标坐标计算菜单弹出位置并显示
function onOpenMenu(ci: IMenuItem[], cx: number, cy: number) {
  items.value = ci
  nextTick(() => {
    if (!menu.value) return
    const wid = menu.value.offsetWidth
    const hei = menu.value.offsetHeight
    posx.value = cx + wid > window.innerWidth ? cx - wid : cx
    posy.value = cy + hei > window.innerHeight ? cy - hei : cy
    show.value = true
  })
}
function onCloseMenu() {
  show.value = false
  posx.value = 0
  posy.value = 0
  items.value = []
}
function onClick(item: IMenuItem) {
  onCloseMenu()
  item.action()
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/style' as *;
$item-hei: 30px;
$item-pad: 11px;
$icon-hei: 17px;
.KMenu {
  @include k-tooltip(fixed);
  z-index: 1;
  padding: 4px 0;
  user-select: none;
  clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  &.show {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transition: clip-path .2s;
  }
  >.item {
    height: $item-hei;
    padding: 0 $item-pad;
    display: flex;
    align-items: center;
    &:hover { background-color: #dadada; }
    &:active { background-color: #c2c2c2; }
    >.icon {
      height: $icon-hei;
      width: $icon-hei;
      margin-right: 8px;
    }
    >.label {
      line-height: $item-hei;
      font-size: 14px;
    }
  }
}
</style>
