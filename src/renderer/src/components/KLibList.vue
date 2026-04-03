<template>
  <div class="KLibList" ref="list" @scroll="onListScroll" v-if="listIsShow">
    <div class="scroll-wrap" :style="{ paddingBottom: Math.max(0, prop.items.length - itemStaCpt - itemNumber) * itemHeight + 122 + 'px' }">
      <div class="item" v-for="(item, idx) in itemShowList" :key="item.path" :class="{ even: (itemStaCpt + idx) % 2 === 0, select: item.path === path }"
        :style="{ height: itemHeight + 'px' }" v-ctx-menu="itemMenu" @contextmenu="onItemCtx(idx + itemStaCpt)" @click="onItemClick(idx + itemStaCpt)">
        <span class="text" v-tooltip.immediate.overflow="item.name">{{ item.name + (item['ext'] ?? '') }}</span>
        <span class="text" v-if="mode === 'normal'" v-tooltip.immediate.overflow="item['artist']">{{ item['artist'] }}</span>
        <span class="text" v-if="mode === 'normal'">{{ formatTime(item['duration'], 'mm:ss') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatTime } from '@renderer/utils/tools'
import { vTooltip } from '@renderer/directives/Tooltip'
import { vCtxMenu } from '@renderer/directives/Menu'
const prop = defineProps<{
  /** 列表项目 */ items: ILibItem[],
  /** 列表模式 */ mode?: ListMode,
  /** 选中路径 */ path?: string
}>()
const emit = defineEmits<{ select: [value: number] }>() // 项目选中事件，传递选中的索引
const list = ref<HTMLElement>() // 列表元素
const listIsShow = ref(true)
const listHeight = ref(0) // 动态列表高度
const itemHeight = 40 // 列表项高度
const itemNumber = computed(() => Math.floor(listHeight.value / itemHeight) + 1) // 虚拟列表显示的数量至少覆盖列表高度
const itemStaRef = ref(0) // 虚拟列表加载的起始位置
const itemStaCpt = computed({
  get: () => itemStaRef.value,
  set: (v: number) => { itemStaRef.value = Math.max(0, Math.min(v, prop.items.length - itemNumber.value)) }
}) // 保证虚拟列表加载的起始位置不超出范围
const itemShowList = computed(() => prop.items.slice(itemStaCpt.value, itemStaCpt.value + itemNumber.value)) // 虚拟列表只显示需要显示的item
const listObserver = new ResizeObserver(() => { listHeight.value = list.value?.offsetHeight ?? 0 })
const itemMenu = [
  { label: '播放', action: onItemCtxPlay },
  { label: '信息', action: () => {} },
  { label: '删除', action: () => {} },
  { label: '添加到播放列表', action: () => {} },
  { label: '在文件资源管理器中显示', action: onItemCtxOpen },
]
let ctxIdx: number = 0 // 右键点击的项目
watch(() => prop.items, async () => {
  itemStaCpt.value = 0
  // 强制浏览器刷新渲染，否则滚动条高度不变
  listIsShow.value = false
  await nextTick()
  listIsShow.value = true
}, { deep: false })
onMounted(() => {
  if (!list.value) return
  listObserver.observe(list.value)
})
onUnmounted(() => {
  listObserver.disconnect()
})

// 滚动时更新虚拟列表
function onListScroll(e: Event) {
  const list = e.currentTarget as HTMLElement
  const wrap = list.children[0] as HTMLElement
  itemStaCpt.value = Math.floor(list.scrollTop / itemHeight);
  wrap.style.transform = `translateY(${itemStaCpt.value * itemHeight}px)`
}
function onItemClick(idx: number) { emit('select', idx) }
function onItemCtx(idx: number) { ctxIdx = idx }
function onItemCtxPlay() { emit('select', ctxIdx) }
function onItemCtxOpen() { window.she.showItemInFolder(prop.items[ctxIdx].path) }
</script>

<style scoped lang="scss">
@use '@renderer/assets/style';
@use '@renderer/assets/var';

.KLibList {
  height: 100%;
  width: 100%;
  @include style.k-scrollbar(auto, transparent, var.$music-hei);
  >.scroll-wrap {
    >.item {
      user-select: none;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      &.even { background-color: #f2f2f2; }
      &:hover { background-color: #d9d9d9; }
      &:active { background-color: #aeaeae; }
      &.select {
        color: white;
        background-color: #0078d7;
        &:hover { background-color: #005a9e; }
        &:active { background-color: #00487e; }
      }
      >.text {
        margin-left: 10px;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:nth-child(2) { width: 100px; }
        &:nth-child(3) {
          width: 50px;
          text-align: center;
        }
        &:first-child {
          width: 0;
          flex: 1;
        }
        &:last-child { margin-right: 10px; }
      }
    }
  }
}
</style>
