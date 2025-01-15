<template>
  <div class="KLibList" @scroll="onScroll">
    <div class="scroll-wrap">
      <div class="item" v-for="(item, idx) in itemShow" :key="item.path" :class="{ even: (itemStart + idx) % 2 === 0, select: item.path === path }"
        v-ctx-menu="itemMenu" @contextmenu="onItemCtx(item)" @click="onItemClick(item)">
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
const prop = defineProps<{
  /** 列表项目 */
  items: ILibItem[],
  /** 列表模式 */
  mode?: ListMode,
  /** 选中项目路径 */
  path?: string
}>()
const emit = defineEmits<{ select: [value: ILibItem] }>()// 选中项目事件
const itemHeight = 40// 列表项高度
const itemNum = Math.floor(window.screen.height / itemHeight) // 虚拟列表显示的数量至少覆盖屏幕
const itemstart = ref(0)// 虚拟列表加载的起始位置
const itemStart = computed({
  get: () => itemstart.value,
  set: (v: number) => {
    if (v < 0) { itemstart.value = 0 }
    else if (v > prop.items.length - itemNum) { itemstart.value = prop.items.length - itemNum }
    else { itemstart.value = v }
  }
})// 保证虚拟列表加载的起始位置不超出范围
const itemShow = computed(() => prop.items.slice(itemStart.value, itemStart.value + itemNum))// 虚拟列表只显示需要显示的item
const itemMenu = [
  { label: '播放', action: onItemCtxPlay },
  { label: '信息', action: () => {} },
  { label: '删除', action: () => {} },
  { label: '添加到播放列表', action: () => {} },
  { label: '在文件资源管理器中显示', action: onItemCtxOpen },
]
let itemCtx: ILibItem | null = null// 右键点击的项目
/** 滚动时更新虚拟列表 */
function onScroll(e: Event) {
  // 列表组件顶层元素
  const top = e.currentTarget as HTMLElement
  itemStart.value = Math.floor(top.scrollTop / itemHeight);
  // 列表组件的滚动元素
  const wrap = top.children[0] as HTMLElement
  wrap.style.transform = `translateY(${itemStart.value * itemHeight}px)`
}
function onItemClick(item: ILibItem) { emit('select', item) }
function onItemCtx(item: ILibItem) { itemCtx = item }
function onItemCtxPlay() { emit('select', itemCtx!) }
function onItemCtxOpen() { window.shell.showItemInFolder(itemCtx!.path) }
</script>

<style scoped lang="scss">
@use '@renderer/assets/global';

.KLibList {
  height: 100%;
  width: 100%;
  @include global.k-scroll-bar;
  .scroll-wrap {
    // 维持虚拟列表的滚动条为原长度
    padding-bottom: v-bind('(items.length - itemStart - itemNum) * itemHeight + "px"');
    .item {
      height: v-bind('itemHeight + "px"');
      display: flex;
      justify-content: flex-end;
      align-items: center;
      user-select: none;
      &.even { background-color: #f2f2f2; }
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
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
