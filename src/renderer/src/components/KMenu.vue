<template>
  <Teleport to="body">
    <div class="KMenu" ref="menuCon">
      <div class="List" :class="menuShow ? 'visible' : ''">
        <div class="Item" v-for="item in menuItems" :key="item.label" @click="onClick(item)">
          <img class="Icon" v-if="item.icon" :src="item.icon" />
          <span>{{ item.label }}</span>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'KMenu',
  props: {
    menu: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    'select'
  ],
  setup(props, { emit }) {
    const menuCon = ref<HTMLDivElement | null>(null)
    const menuItems = ref<IMenuItem[]>(props.menu as IMenuItem[])
    const menuShow = ref(false)
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
      x.value = e.clientX + menuCon.value!.offsetWidth > window.innerWidth ? e.clientX - menuCon.value!.offsetWidth : e.clientX
      y.value = e.clientY + menuCon.value!.offsetHeight > window.innerHeight ? e.clientY - menuCon.value!.offsetHeight : e.clientY
      menuShow.value = true
    }
    function onCloseMenu() {
      menuShow.value = false
    }
    function onClick(item: IMenuItem) {
      menuShow.value = false
      emit('select', item.label)
    }
    return { menuCon, menuItems, menuShow, x, y, onOpenMenu, onCloseMenu, onClick }
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
  visibility: v-bind('menuShow ? "visible" : "hidden"');
  >.List {
    @include tool-tip;
    padding-top: 4px;
    padding-bottom: 4px;
    visibility: hidden;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    &.visible {
      visibility: visible;
      clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
      transition: clip-path .2s;
    }
    >.Item {
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
      >.Icon {
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
