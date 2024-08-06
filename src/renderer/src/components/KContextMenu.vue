<template>
  <KMenu :menu="menuItems" ref="menuCon" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KMenu from './KMenu.vue'
export default defineComponent({
  name: 'KContextMenu',
  props: {
    menuDiv:{
      type: HTMLElement,
      default: () => null
    },
    menu: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const menuDiv = computed(() => props.menuDiv)
    const menuCon = ref<InstanceType<typeof KMenu> | null>(null)
    const menuItems = ref<IMenuItem[]>(props.menu as IMenuItem[])
    onMounted(() => {
      nextTick(() => menuDiv.value?.addEventListener('contextmenu', onMenu))
    })
    onUnmounted(() => {
      menuDiv.value.removeEventListener('contextmenu', onMenu)
    })
    function onMenu(ev: MouseEvent) {
      menuCon.value?.onOpenMenu(ev)
    }
    return { menuCon, menuItems }
  }
})
</script>
