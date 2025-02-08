<template>
  <Transition name="drop">
    <div v-if="show" class="KDropdown">
      <div v-for="opt in options" :key="opt.label" :class="{ option: true, cur: opt.label === cur?.label }"
        v-tooltip.immediate.overflow="opt.label" @click.stop="onOptClick(opt)">
        {{ opt.label }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
interface Option { label: string, value: any }
const show = defineModel<boolean>()// 是否显示下拉框
const emit = defineEmits<{ change: [val: Option] }>()// 选中项改变时通知父组件
defineProps<{ cur?: Option, options: Option[] }>()// 当前选中项和选项列表
// 点击选项时关闭下拉框并发射选中项改变事件
function onOptClick(opt: Option) {
  show.value = false
  emit('change', opt)
}
</script>

<style scoped lang="scss">
// 下拉动画
.drop-enter-active, .drop-leave-active {
  transition: all 0.3s ease;
}
.drop-enter-from, .drop-leave-to {
  opacity: 0;
  transform: translate(0, -40px) scaleY(0.2);
}
// 下拉框
.KDropdown {
  position: absolute;
  z-index: 1;
  top: calc(100% + 12px);
  width: 100%;
  background-color: #ffffff;
  box-shadow: 0 0 10px #00000030;
  border: 1px solid #e4e7ed;
  padding: 6px 0;
  // 三角箭头
  &::before {
    $tri-size: 10px;
    $tri-half: calc($tri-size / 2);
    content: '';
    position: absolute;
    top: -$tri-size;
    left: calc(50% - $tri-half);
    width: $tri-size;
    height: $tri-size;
    border: $tri-half solid transparent;
    border-bottom: $tri-half solid white;
  }
  // 选项
  >.option {
    $opt-height: 35px;
    height: $opt-height;
    line-height: $opt-height;
    padding: 0 20px;
    font-size: 14px;
    color: black;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      background-color: #f5f7fa;
      cursor: pointer;
    }
    // 选中项
    &.cur {
      color: #0078d7;
      font-weight: bold;
    }
  }
}
</style>
