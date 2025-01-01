<template>
  <KDropdown v-model="showDrop" :cur="curOpt" :options="props.options" @change="onChange" @mouseleave="onMouseLeave">
    <div class="select">
      <div class="text"><span v-tooltip.overflow="curOpt?.label||''">{{ curOpt?.label }}</span></div>
      <div class="icon" @mouseenter="onMouseEnter"><svg><path d="m8,6 l4,4 l-4,4" /></svg></div>
    </div>
  </KDropdown>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
interface Option { label: string, value: string }
const emit = defineEmits<{ change: [val: string] }>()
const props = defineProps<{ options: Option[] }>()
const curVal = defineModel<string>()// 当前选中项的值
const curOpt = computed(() => props.options.find(opt => opt.value === curVal.value))// 当前选中项
const showDrop = ref(false)// 是否显示下拉框
const msTarget = ref<Node>()// 鼠标目标
const selectEle = ref<HTMLDivElement>()// 选择器元素

onMounted(() => { document.addEventListener('mousemove', onMouseMove) })
onUnmounted(() => { document.removeEventListener('mousemove', onMouseMove) })
// 监听鼠标移动事件
function onMouseMove(e: MouseEvent) { msTarget.value = e.target as Node }
function onMouseEnter(e: MouseEvent) {
  showDrop.value = true
  // 选择器元素是下拉框图标的父元素的父元素
  selectEle.value = (e.target as Node).parentElement!.parentElement as HTMLDivElement
}
// 延迟0.15s判断鼠标是否已离开，因为选择框与下拉框之间有间隙，通过间隙时应保持下拉框显示
function onMouseLeave() {
  setTimeout(() => {
    if (!msTarget.value || !selectEle.value) return
    if (!selectEle.value.contains(msTarget.value)) showDrop.value = false
  }, 150)
}
function onChange(opt: Option) {
  curVal.value = opt.value
  emit('change', opt.value)
}
</script>

<style scoped lang="scss">
.select {
  height: 100%;
  width: 100%;
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
