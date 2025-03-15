<template>
  <div class="KMenu" ref="menu" :class="{ visible: show }">
    <div class="item" v-for="item in items" :key="item.label" @click="onClick(item)">
      <component class="icon" v-if="item.icon" :is="item.icon" />
      <span class="label">{{ item.label }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const menu = ref<HTMLDivElement>()
const show = ref(false)
const items = shallowRef<IMenuItem[]>([])
const x = ref(0)
const y = ref(0)
defineExpose({ items, onOpenMenu })
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
    if (!menu.value) return
    const divWidth = menu.value.offsetWidth
    const divHeight = menu.value.offsetHeight
    x.value = e.clientX + divWidth > window.innerWidth ? e.clientX - divWidth : e.clientX
    y.value = e.clientY + divHeight > window.innerHeight ? e.clientY - divHeight : e.clientY
    show.value = true
  })
}
function onCloseMenu() {
  show.value = false
  items.value = []
  x.value = 0
  y.value = 0
}
function onClick(item: IMenuItem) {
  onCloseMenu()
  item.action()
}
</script>

<style scoped lang="scss">
@use '@renderer/assets/style';
$item-height: 30px;
$item-padding: 11px;
$icon-size: 17px;

.KMenu {
  @include style.k-tooltip(fixed);
  z-index: 1;
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  padding: 4px 0;
  user-select: none;
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
    &:hover { background-color: #dadada; }
    &:active { background-color: #c2c2c2; }
    >.icon {
      height: $icon-size;
      width: $icon-size;
      margin-right: 8px;
    }
    >.label {
      line-height: $item-height;
      font-size: 15px;
    }
  }
}
</style>
