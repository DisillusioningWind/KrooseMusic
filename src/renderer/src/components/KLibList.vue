<template>
  <div class="KLibList">
    <div class="Item" v-for="item in items" :key="item.path" :class="cur===item?'select':''"
      v-ctx-menu="menu" @contextmenu="onItemCtx(item)" @click="onItemClick(item)">
      <span v-tooltip.immediate.overflow="item.name">{{ item.name + (mode === 'normal'?(item as ILibMusic).ext:'') }}</span>
      <span v-if="mode === 'normal'" v-tooltip.immediate.overflow="(item as ILibMusic).artist">{{ (item as ILibMusic).artist }}</span>
      <span v-if="mode === 'normal'">{{ formatTime((item as ILibMusic).duration, 'mm:ss') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu } from '@renderer/directives/Menu'
defineProps<{
  /** 模式，决定列的显示 */
  mode: LibMode,
  /** 数据 */
  items: ILibItem[],
  /** 当前选中 */
  cur?: ILibItem
}>()
const emit = defineEmits<{ select: [value: ILibItem] }>()
let itemCtx: ILibItem | null = null
const menu = [
  { label: '播放', action: onItemCtxPlay },
  { label: '信息', action: () => {} },
  { label: '删除', action: () => {} },
  { label: '添加到播放列表', action: () => {} },
  { label: '在文件资源管理器中显示', action: onItemCtxOpen },
]
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
.KLibList {
  height: 100%;
  width: 100%;
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
}
</style>
