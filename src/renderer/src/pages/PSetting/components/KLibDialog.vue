<template>
  <KDialog class="KLibDialog" :show="show" :center="30">
    <div v-if="step==='confirm'" class="confirm">
        <!-- 第一行 -->
        <Direc />
        <span>当前目录</span>
        <span>{{ path }}</span>
        <!-- 第二行 -->
        <span></span>
        <span>选择模式</span>
        <el-select v-model="mode" size="small" popper-class="k-popper">
          <el-option label="普通" value="normal" />
          <el-option label="ASMR" value="asmr" />
        </el-select>
    </div>
    <div v-else class="adding">
      <Refre />
      <span>正在添加音乐</span>
      <span>{{ num }} 首音乐，共计 {{ total }} 首</span>
    </div>
    <div class="btnList">
      <button v-show="step==='confirm'" @click="onConfirm"><Check /></button>
      <button @click="onClose"><Close /></button>
    </div>
  </KDialog>
</template>

<script setup lang="ts">
import Direc from '@renderer/assets/icons/dir.svg?component'
import Refre from '@renderer/assets/icons/refresh.svg?component'
import Check from '@renderer/assets/icons/check.svg?component'
import Close from '@renderer/assets/icons/close.svg?component'
const show = defineModel<boolean>({ default: false })
const emit = defineEmits<{ confirm: [val: LibMode], close: [] }>()
const props = defineProps<{
  /** 当前目录路径 */
  path: string,
  /** 已添加的音乐数量 */
  num: number,
  /** 总共需要添加的音乐数量 */
  total: number
}>()
const step = ref<'confirm' | 'adding'>('confirm')// 确认步骤和添加步骤
const mode = ref<LibMode>('normal')// 确认时提交给父组件
// 弹窗显示时自动切换到确认步骤
watch(show, v => { if (v) { step.value = 'confirm' } })
// 添加音乐数量达到总数时自动关闭弹窗
watch(() => props.num, v => { if (v >= props.total) { show.value = false } })
function onConfirm() {
  step.value = 'adding'
  emit('confirm', mode.value)
}
function onClose() {
  show.value = false
  emit('close')
}
</script>

<style scoped lang="scss">
$btn-width: 30px;
$svg-width: 21px;
@mixin k-svg {
  width: $svg-width;
  height: $svg-width;
  fill: #ffffff;
}

.KLibDialog {
  border: none;
  padding: 13px;
  background-color: #005a9e;
  color: #ffffff;
  font-size: 17px;
  display: flex;
  // 确认步骤
  .confirm {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 25px 74px auto;
    row-gap: 5px;
    align-items: start;
    // 文件夹图标
    >svg { @include k-svg; }
  }
  // 添加步骤
  .adding {
    display: grid;
    grid-template-rows: auto auto;
    grid-template-columns: 25px 300px;
    row-gap: 5px;
    align-items: center;
    user-select: none;
    // 刷新图标
    >svg {
      @include k-svg;
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(-360deg); }
      }
      animation: rotate 1s infinite;
    }
    >span:last-child {
      grid-column: 1 / 3;
      font-size: 15px;
      font-weight: 100;
      color: #ffffffd8;
    }
  }
  // 按钮列表
  .btnList {
    display: flex;
    >button {
      width: $btn-width;
      height: 100%;
      border: none;
      padding: 0;
      background-color: transparent;
      >svg { @include k-svg; }
      &:hover {
        cursor: pointer;
        >svg { fill: #b1b1b1; }
      }
    }
  }
}
</style>
