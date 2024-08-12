<template>
  <div class="KMenu" ref="menuCon">
    <div class="List" :class="menuShow ? 'visible' : ''">
      <div class="Item" v-for="item in menuItems" :key="item.label" @click="onClick(item)">
        <img class="Icon" v-if="item.icon" :src="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { bus } from '@renderer/utils/emitter'
export default defineComponent({
  setup() {
    const menuCon = ref<HTMLDivElement | null>(null)
    const menuItems = ref<IMenuItem[]>([])
    const menuShow = ref(false)
    const menuUID = ref(0)
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
        x.value = e.clientX + menuCon.value!.offsetWidth > window.innerWidth ? e.clientX - menuCon.value!.offsetWidth : e.clientX
        y.value = e.clientY + menuCon.value!.offsetHeight > window.innerHeight ? e.clientY - menuCon.value!.offsetHeight : e.clientY
        menuShow.value = true
      })
    }
    function onCloseMenu() {
      menuItems.value = []
      menuShow.value = false
      x.value = 0
      y.value = 0
    }
    function onClick(item: IMenuItem) {
      onCloseMenu()
      bus.menuSelectEmit({ uid: menuUID.value, value: item.label })
    }
    return { menuCon, menuItems, menuShow, menuUID, x, y, onOpenMenu, onCloseMenu, onClick }
  }
})
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';
$item-height: 30px;
$item-padding: 11px;
$icon-size: 17px;
.KMenu {
  position: fixed;
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  >.List {
    @include tool-tip;
    padding: 4px 0;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    &.visible {
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      transition: clip-path .2s;
    }
    >.Item {
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
      >.Icon {
        height: $icon-size;
        width: $icon-size;
        margin-right: 8px;
        object-fit: fill;
      }
      >span {
        line-height: $item-height;
        font-size: 15px;
      }
    }
  }
}
</style>
