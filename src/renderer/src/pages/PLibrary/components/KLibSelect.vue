<template>
  <div class="KLibSelect" ref="select" @mouseleave="onMouseLeave">
    <div class="text"><span v-tooltip.overflow="curOpt?.[label]">{{ curOpt?.[label] }}</span></div>
    <div class="icon" @mouseenter="onMouseEnter"><svg><path d="m8,6 l4,4 l-4,4" /></svg></div>
    <KDropdown v-model="show" :cur="curOpt" :opts="opts" :label="label" @change="onChange" />
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
type Option = Record<string, any>
const emit = defineEmits<{ change: [val: Option] }>()// 选中项改变时通知父组件
defineProps<{
  /** 选项列表 */ opts: Option[],
  /** 标签属性 */ label: string
}>()
const curOpt = defineModel<Option>()// 当前选中项
const show = ref(false)// 是否显示下拉框
const select = ref<HTMLDivElement>()// 选择器元素
const msTarget = ref<Node>()// 鼠标目标
// 监听鼠标移动事件
onMounted(() => { document.addEventListener('mousemove', onMouseMove) })
onUnmounted(() => { document.removeEventListener('mousemove', onMouseMove) })
// 监听鼠标移动事件
function onMouseMove(e: MouseEvent) { msTarget.value = e.target as Node }
function onMouseEnter() { show.value = true }
// 延迟0.15s判断鼠标是否已离开，因为选择框与下拉框之间有间隙，通过间隙时应保持下拉框显示
function onMouseLeave() {
  setTimeout(() => {
    if (!msTarget.value || !select.value) return
    if (!select.value.contains(msTarget.value)) show.value = false
  }, 150)
}
// 当前选项改变时通知父组件
function onChange(opt: Option) {
  curOpt.value = opt
  emit('change', opt)
}
</script>

<style scoped lang="scss">
.KLibSelect {
  position: relative;
  user-select: none;
  height: 100%;
  width: fit-content;
  display: flex;
  // 选中项
  >.text {
    margin-right: auto;
    padding: 0 15px;
    border-radius: 5px 0 0 5px;
    background-color: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    &:hover {
      cursor: pointer;
      background-color: #79bbff;
    }
    >span {
      color: white;
      font-size: 17px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  // 下拉图标
  >.icon {
    flex-shrink: 0;
    padding: 0 5px;
    border-radius: 0 5px 5px 0;
    border-left: 1px solid #8ebff2;
    background-color: #409eff;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      background-color: #79bbff;
    }
    >svg {
      $svg-size: 20px;
      width: $svg-size;
      height: $svg-size;
      stroke: white;
      stroke-linejoin: round;
      fill: none;
      transform: rotate(90deg);
    }
  }
}
</style>
