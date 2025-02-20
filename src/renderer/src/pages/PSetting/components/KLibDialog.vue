<template>
  <KDialog class="KLibDialog" :show="show" :center="30">
    <div class="container">
      <div v-if="step === 'confirm'" class="confirm">
        <!-- 第一行 -->
        <Direc />
        <span>当前目录</span>
        <span>{{ path }}</span>
        <!-- 第二行 -->
        <span></span>
        <span>选择模式</span>
        <KSelect class="modeSelect" v-model="mode" :opts="opts" :label="'label'" />
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
    </div>
  </KDialog>
</template>

<script setup lang="ts">
import Direc from '@renderer/assets/icons/dir.svg?component'
import Refre from '@renderer/assets/icons/refresh.svg?component'
import Check from '@renderer/assets/icons/check.svg?component'
import Close from '@renderer/assets/icons/close.svg?component'
type ModeOpt = { label: string, value: LibMode }
const show = defineModel<boolean>({ default: false })
const emit = defineEmits<{ confirm: [val: LibMode], close: [] }>()
const props = defineProps<{
  /** 当前目录路径 */ path: string,
  /** 已添加音乐数量 */ num: number,
  /** 总共音乐数量 */ total: number
}>()
const step = ref<'confirm' | 'adding'>('confirm')// 确认步骤和添加步骤
const modeNorm: ModeOpt = { label: '普通', value: 'normal' }
const modeAsmr: ModeOpt = { label: 'ASMR', value: 'asmr' }
const mode = ref<ModeOpt>(modeNorm)// 确认时提交给父组件
const opts = [modeNorm, modeAsmr]
watch(show, v => { if (v) { step.value = 'confirm' } })// 弹窗显示时自动切换到确认步骤
watch(() => props.num, v => { if (v >= props.total) { show.value = false } })// 添加音乐数量达到总数时自动关闭弹窗
function onConfirm() {
  step.value = 'adding'
  emit('confirm', mode.value.value)
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
  // 允许诸如下拉框等元素溢出
  overflow: visible;
  .container {
    padding: 13px;
    background-color: #005a9e;
    color: #ffffff;
    font-size: 17px;
    display: flex;
    // 确认步骤
    .confirm {
      display: grid;
      grid-template-rows: auto 25px;
      grid-template-columns: 25px 74px auto;
      row-gap: 5px;
      align-items: start;
      // 文件夹图标
      >svg { @include k-svg; }
      // 模式选择
      >.modeSelect {
        height: 25px;
        width: 90px;
      }
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
        animation: rotate 1s infinite;
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(-360deg); }
        }
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
        &:hover {
          cursor: pointer;
          >svg { fill: #b1b1b1; }
        }
        >svg { @include k-svg; }
      }
    }
  }
}
</style>
