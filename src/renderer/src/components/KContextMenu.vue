<template>
  <div class="ctxMenuDiv" ref="menuDiv">
    <slot></slot>
    <Teleport to="body">
      <div class="menu" ref="menuCon">
        <div class="list">
          <div class="item" @click="onClick(item)" v-for="item in menuItems" :key="item.label">
            <img class="icon" v-if="item.icon" :src="item.icon" />
            <span>{{ item.label }}</span>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script lang="ts">
interface MenuItem {
  icon?: string
  label: string
}
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    'select'
  ],
  setup(props) {
    const menuDiv = ref<HTMLDivElement | null>(null)
    const menuCon = ref<HTMLDivElement | null>(null)
    const menuItems = ref<MenuItem[]>(props.menu as MenuItem[])
    const menuShow = ref(false)
    const x = ref(0)
    const y = ref(0)
    // 事件绑定
    onMounted(() => {
      menuDiv.value?.addEventListener('contextmenu', onOpenMenu)
      document.addEventListener('click', onCloseMenu, true)
      document.addEventListener('contextmenu', onCloseMenu, true)
    })
    onUnmounted(() => {
      menuDiv.value?.removeEventListener('contextmenu', onOpenMenu)
      document.removeEventListener('click', onCloseMenu, true)
      document.removeEventListener('contextmenu', onCloseMenu, true)
    })
    // 事件处理
    function onOpenMenu(e: MouseEvent) {
      e.preventDefault()
      e.stopPropagation()
      x.value = e.clientX + menuCon.value!.offsetWidth > window.innerWidth ? e.clientX - menuCon.value!.offsetWidth : e.clientX
      y.value = e.clientY + menuCon.value!.offsetHeight > window.innerHeight ? e.clientY - menuCon.value!.offsetHeight : e.clientY
      menuShow.value = true
    }
    function onCloseMenu() {
      menuShow.value = false
    }
    function onClick(item: MenuItem) {
      console.log(item)
    }
    return { menuDiv, menuCon, menuItems, menuShow, x, y, onClick }
  }
})
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';
$item-height: 30px;
$item-padding: 11px;
$icon-size: 17px;
.menu {
  @include tool-tip;
  border-width: 1.5px;
  position: fixed;
  left: v-bind('x + "px"');
  top: v-bind('y + "px"');
  visibility: v-bind('menuShow ? "visible" : "hidden"');
  >.list {
    margin-top: 4px;
    margin-bottom: 4px;
    >.item {
      height: $item-height;
      line-height: $item-height;
      padding-left: $item-padding;
      padding-right: $item-padding;
      display: flex;
      align-items: center;
      &:hover {
        cursor: default;
        background-color: #dadada;
      }
      >.icon {
        height: $icon-size;
        width: $icon-size;
        margin-right: 8px;
        object-fit: fill;
      }
      >span {
        font-size: 15px;
      }
    }
  }
}
</style>
