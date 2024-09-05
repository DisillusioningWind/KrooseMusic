<template>
  <div class="KLibList" @scroll="onScroll" >
    <div>
      <div class="Item" v-for="item in itemsShow" :key="item.path" :class="cur===item?'select':''"
        v-ctx-menu="menu" @contextmenu="onItemCtx(item)" @click="onItemClick(item)">
        <span v-tooltip.immediate.overflow="item.name">{{ item.name + (mode === 'normal'?(item as ILibMusic).ext:'') }}</span>
        <span v-if="mode === 'normal'" v-tooltip.immediate.overflow="(item as ILibMusic).artist">{{ (item as ILibMusic).artist }}</span>
        <span v-if="mode === 'normal'">{{ formatTime((item as ILibMusic).duration, 'mm:ss') }}</span>
      </div>
      <div class="Blank"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu } from '@renderer/directives/Menu'
const prop = defineProps<{
  /** 模式，决定列的显示 */
  mode: LibMode,
  /** 数据 */
  items: ILibItem[],
  /** 当前选中 */
  cur?: ILibItem
}>()
const emit = defineEmits<{ select: [value: ILibItem] }>()
const start = ref(0)
const itemStart = computed({
  get: () => start.value,
  set: (v: number) => {
    if (v < 0) {
      start.value = 0
    } else if (v > prop.items.length - 20) {
      start.value = prop.items.length - 20
    } else {
      start.value = v
    }
  }
})
const itemsShow = computed(() => prop.items.slice(itemStart.value, itemStart.value + 20))
const menu = [
  { label: '播放', action: onItemCtxPlay },
  { label: '信息', action: () => {} },
  { label: '删除', action: () => {} },
  { label: '添加到播放列表', action: () => {} },
  { label: '在文件资源管理器中显示', action: onItemCtxOpen },
]
let itemCtx: ILibItem | null = null
function onScroll(e: Event) {
  const el = e.currentTarget as HTMLElement
  itemStart.value = Math.floor(el.scrollTop / 40);
  (el.children[0] as HTMLElement).style.transform = `translateY(${itemStart.value * 40}px)`
}
function onItemClick(item: ILibItem) {
  emit('select', item)
}
function onItemCtx(item: ILibItem) {
  itemCtx = item
}
function onItemCtxPlay() {
  emit('select', itemCtx!)
}
function onItemCtxOpen() {
  window.shell.showItemInFolder(itemCtx!.path)
}
</script>

<style scoped lang="scss">
@mixin KScrollBar($track-color: transparent){
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #bababa;
    &:hover {
      background-color: #8c8c8c;
    }
    &:active {
      background-color: #5d5d5d;
    }
  }
  &::-webkit-scrollbar-track {
    background-color: $track-color;
  }
}
.KLibList {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  @include KScrollBar;
  .Item {
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    user-select: none;
    &:nth-child(odd) {
      background-color: #f2f2f2;
    }
    &:hover {
      background-color: #d9d9d9;
    }
    &:active {
      background-color: #aeaeae;
    }
    &.select {
      color: white;
      background-color: #0078d7;
      &:hover {
        background-color: #005a9e;
      }
      &:active {
        background-color: #00487e;
      }
    }
    >span {
      margin-left: 10px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      &:last-child {
        margin-right: 10px;
        width: 50px;
        text-align: center;
      }
      &:nth-child(2) {
        width: 100px;
      }
      &:first-child {
        flex: 1;
        text-align: left;
      }
    }
  }
  .Blank {
    height: v-bind('(items.length - itemStart - 20) * 40 + "px"');
  }
}
</style>
