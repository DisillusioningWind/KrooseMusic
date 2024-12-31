<template>
  <KDropdown v-model="showDrop" :cur="curOpt" :options="options" @change="onChange">
    <div class="select" @click="showDrop = !showDrop">
      <span v-tooltip.overflow="curOpt?.label||''">{{ curOpt?.label }}</span>
      <svg :class="showDrop?'show-drop':''"><path d="m8,6 l4,4 l-4,4" /></svg>
    </div>
  </KDropdown>
</template>

<script setup lang="ts">
import { vTooltip } from '@renderer/directives/Tooltip'
interface Option {
  label: string,
  value: string
}
const emit = defineEmits<{ change: [val: string] }>()
const props = defineProps<{ options: Option[] }>()
const curVal = defineModel<string>()
const curOpt = computed(() => props.options.find(opt => opt.value === curVal.value))
const showDrop = ref(false)

function onChange(opt: Option) {
  curVal.value = opt.value
  emit('change', opt.value)
}
</script>

<style scoped lang="scss">
$svg-size: 20px;
.select {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  padding: 0 8px 0 10px;
  background-color: #ffffff;
  display: flex;
  align-items: center;
  &:hover { cursor: pointer; }
  // 选中项
  >span {
    margin-right: auto;
    color: #666666;
    font-size: 15px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  // 下拉图标
  >svg {
    width: $svg-size;
    height: $svg-size;
    stroke: #747474;
    stroke-linejoin: round;
    fill: none;
    flex-shrink: 0;
    transform: rotate(90deg);
    transition: all 0.3s;
    &.show-drop { transform: rotate(-90deg); }
  }
}
</style>
