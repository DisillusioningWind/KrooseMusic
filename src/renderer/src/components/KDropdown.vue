<template>
  <div class="KSelect" ref="select">
    <!-- 选择框 -->
    <slot></slot>
    <!-- 下拉框 -->
    <Transition name="drop">
      <div v-if="show" class="dropdown">
        <div v-for="option in options" :key="option.value" class="option" :class="option===cur?'cur':''"
          v-tooltip.immediate.overflow="option.label" @click="onOptClick(option)">
          {{ option.label }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
interface Option {
  label: string,
  value: string
}
const show = defineModel<boolean>()// 是否显示下拉框
const emit = defineEmits<{ change: [val: Option] }>()
const select = ref<HTMLDivElement>()
defineProps<{
  /** 选中项 */
  cur?: Option,
  /** 选项列表 */
  options: Option[],
}>()

onMounted(() => {
  document.addEventListener('click', onDocClick)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
})
// 点击文档其他地方关闭下拉框
function onDocClick(e: MouseEvent) {
  if (!select.value || !show.value) return
  show.value = select.value.contains(e.target as Node)
}
// 点击选项时关闭下拉框
function onOptClick(opt: Option) {
  emit('change', opt)
  show.value = false
}
</script>

<style scoped lang="scss">
$opt-height: 35px;
.KSelect {
  position: relative;
  user-select: none;
  // 下拉动画
  .drop-enter-active, .drop-leave-active {
    transition: all 0.3s ease;
  }
  .drop-enter-from, .drop-leave-to {
    opacity: 0;
    transform: translate(0, -40px) scaleY(0.2);
  }
  // 下拉框
  >.dropdown {
    position: absolute;
    top: calc(100% + 12px);
    z-index: 1;
    width: 100%;
    background-color: #ffffff;
    border: 1px solid #e4e7ed;
    box-shadow: 0 0 10px #00000030;
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
      box-sizing: border-box;
      border: $tri-half solid transparent;
      border-bottom: $tri-half solid white;
    }
    // 选项
    >div {
      height: $opt-height;
      line-height: $opt-height;
      padding: 0 20px;
      font-size: 14px;
      color: black;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
}
</style>
