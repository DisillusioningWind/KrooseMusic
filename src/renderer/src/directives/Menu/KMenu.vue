<template>
  <div class="KMenu" ref="menuDiv">
    <div class="List" :class="menuShow ? 'Visible' : ''">
      <div class="Item" v-for="item in menuItems" :key="item.label" @click="onClick(item)">
        <img v-if="item.icon" :src="item.icon" />
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const menuItems = ref<IMenuItem[]>([])
    const menuShow = ref(false)
    const menuDiv = ref<HTMLDivElement | null>(null)
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
    return { menuDiv, menuItems, menuShow, x, y, onOpenMenu, onClick }
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
  z-index: 1;
  >.List {
    @include tool-tip;
    padding: 4px 0;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    &.Visible {
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
      >img {
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
