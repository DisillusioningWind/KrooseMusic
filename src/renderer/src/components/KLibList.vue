<template>
  <div class="KLibList" @scroll="onScroll">
    <div class="scroll-wrap">
      <div class="item" v-for="item in itemShow" :key="item.path" :class="curPath === item.path?'select':(item['id']%2 === 0?'odd':'')"
        v-ctx-menu="menu" @contextmenu="onItemCtx(item)" @click="onItemClick(item)">
        <span v-tooltip.immediate.overflow="item.name">{{ item.name + (item['ext']??'') }}</span>
        <span v-if="mode === 'normal'" v-tooltip.immediate.overflow="item['artist']">{{ item['artist'] }}</span>
        <span v-if="mode === 'normal'">{{ formatTime(item['duration'], 'mm:ss') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu } from '@renderer/directives/Menu'
const prop = defineProps<{ mode?: ListMode, items: ILibItem[], curPath?: string }>()
const emit = defineEmits<{ select: [value: ILibItem] }>()
const itemHeight = 40
const itemShowNum = Math.floor(window.screen.height / itemHeight) // 虚拟加载显示的数量至少覆盖屏幕
const _itemStart = ref(0)
const itemStart = computed({
  get: () => _itemStart.value,
  set: (v: number) => {
    if (v < 0) { _itemStart.value = 0 }
    else if (v > prop.items.length - itemShowNum) { _itemStart.value = prop.items.length - itemShowNum }
    else { _itemStart.value = v }
  }
})
/** 虚拟列表只显示需要显示的item，id用于item的奇偶判断 */
const itemShow = computed(() => prop.items.slice(itemStart.value, itemStart.value + itemShowNum).map((v, i) => { v['id'] = itemStart.value + i; return v }))
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
  itemStart.value = Math.floor(el.scrollTop / itemHeight);
  (el.children[0] as HTMLElement).style.transform = `translateY(${itemStart.value * itemHeight}px)`
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
@import '@renderer/assets/global';

.KLibList {
  height: 100%;
  width: 100%;
  @include k-scroll-bar;
  .scroll-wrap {
    // 维持虚拟列表的滚动条为原长度
    padding-bottom: v-bind('(items.length - itemStart - itemShowNum) * itemHeight + "px"');
    .item {
      height: v-bind('itemHeight + "px"');
      display: flex;
      justify-content: flex-end;
      align-items: center;
      user-select: none;
      &.odd { background-color: #f2f2f2; }
      &:hover { background-color: #d9d9d9; }
      &:active { background-color: #aeaeae; }
      &.select {
        color: white;
        background-color: #0078d7;
        &:hover { background-color: #005a9e; }
        &:active { background-color: #00487e; }
      }
      >span {
        margin-left: 10px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 14px;
        &:nth-child(2) { width: 100px; }
        &:last-child {
          width: 50px;
          margin-right: 10px;
          text-align: center;
        }
        &:first-child {
          width: 0;
          flex: 1;
          text-align: left;
        }
      }
    }
  }
}
</style>
