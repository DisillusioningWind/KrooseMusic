<template>
  <div class="KSelect" ref="select">
    <div class="text" @click="show = !show"><span v-tooltip.overflow="curOpt?.[label]">{{ curOpt?.[label] }}</span></div>
    <div class="icon" @click="show = !show"><svg :class="{ show }"><path d="m8,6 l4,4 l-4,4" /></svg></div>
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
// 监听文档点击事件
onMounted(() => { document.addEventListener('click', onDocClick) })
onUnmounted(() => { document.removeEventListener('click', onDocClick) })
// 点击文档其他位置关闭下拉框
function onDocClick(e: MouseEvent) {
  if (!select.value || !show.value) return
  if (!select.value.contains(e.target as Node)) show.value = false
}
// 当前选项改变时通知父组件
function onChange(opt: Option) {
  curOpt.value = opt
  emit('change', opt)
}
</script>

<style scoped lang="scss">
.KSelect {
  position: relative;
  height: 100%;
  background-color: #ffffff;
  user-select: none;
  display: flex;
  // 选中项
  >.text {
    flex: 1;
    padding: 0 3px 0 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    &:hover { cursor: pointer; }
    >span {
      font-size: 15px;
      color: #666666;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  // 下拉图标
  >.icon {
    flex-shrink: 0;
    padding: 0 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover { cursor: pointer; }
    >svg {
      $svg-size: 20px;
      width: $svg-size;
      height: $svg-size;
      stroke: #747474;
      stroke-linejoin: round;
      fill: none;
      transform: rotate(90deg);
      transition: all 0.3s;
      &.show { transform: rotate(-90deg); }
    }
  }
}
</style>
