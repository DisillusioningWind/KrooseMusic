<template>
  <div class="KMenu" ref="menuDiv" :class="menuShow?'visible':''">
    <div class="item" v-for="item in menuItems" :key="item.label" @click="onClick(item)">
      <component v-if="item.icon" :is="item.icon" />
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const menuItems = shallowRef<IMenuItem[]>([])
const menuShow = ref(false)
const menuDiv = ref<HTMLDivElement>()
const x = ref(0)
const y = ref(0)
// 事件绑定
onMounted(() => {
  document.addEventListener('click', onCloseMenu, true)
  document.addEventListener('contextmenu', onCloseMenu, true)
})
onUnmounted(() => {
  document.removeEventListener('click', onCloseMenu, true)
  document.removeEventListener('contextmenu', onCloseMenu, true)
})
// 事件处理
function onOpenMenu(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  nextTick(() => {
    const divWidth = menuDiv.value!.offsetWidth
    const divHeight = menuDiv.value!.offsetHeight
    x.value = e.clientX + divWidth > window.innerWidth ? e.clientX - divWidth : e.clientX
    y.value = e.clientY + divHeight > window.innerHeight ? e.clientY - divHeight : e.clientY
    menuShow.value = true
  })
}
function onCloseMenu() {
  menuShow.value = false
  menuItems.value = []
  x.value = 0
  y.value = 0
}
function onClick(item: IMenuItem) {
  onCloseMenu()
  item.action()
}
defineExpose({ menuItems, onOpenMenu })
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';
$item-height: 30px;
$item-padding: 11px;
$icon-size: 17px;

.KMenu {
  position: fixed;
  left: v-bind('x+"px"');
  top: v-bind('y+"px"');
  z-index: 1;
  @include tool-tip;
  padding: 4px 0;
  clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
  &.visible {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    transition: clip-path .2s;
  }
  >.item {
    height: $item-height;
    padding: 0 $item-padding;
    display: flex;
    align-items: center;
    &:hover {
      cursor: default;
      background-color: #dadada;
    }
    &:active {
      background-color: #c2c2c2;
    }
    >svg {
      height: $icon-size;
      width: $icon-size;
      margin-right: 8px;
    }
    >span {
      line-height: $item-height;
      font-size: 15px;
    }
  }
}
</style>
