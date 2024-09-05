<template>
  <div class="KTitleBar">
    <button class="BackBtn" :class="showDetail?'Detail':(navExpand?'Expand':'')" @click="store.toggleDetail()">
      <span v-show="navExpand && !showDetail">Kroose 音乐</span>
      <svg height="100%" width="100%" v-show="showDetail">
        <line x1="31%" y1="50%" x2="68%" y2="50%"/>
        <line x1="31%" y1="50%" x2="46%" y2="34%"/>
        <line x1="31%" y1="50%" x2="46%" y2="66%"/>
      </svg>
    </button>
    <button class="MinBtn" :class="showDetail?'Detail':''" @click="ipc.invoke('minWindow')">
      <svg height="100%" width="100%">
        <line x1="35%" y1="50%" x2="65%" y2="50%"/>
      </svg>
    </button>
    <button class="MaxBtn" :class="showDetail?'Detail':''" @click="ipc.invoke('maxWindow')">
      <svg height="100%" width="100%">
        <rect x="34%" y="32%" width="28%" height="36%" fill="transparent"/>
      </svg>
    </button>
    <button class="CloseBtn" :class="showDetail?'Detail':''" @click="ipc.invoke('closeWindow')">
      <svg height="100%" width="100%">
        <line x1="36%" y1="34%" x2="64%" y2="66%"/>
        <line x1="64%" y1="34%" x2="36%" y2="66%"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const ipc = window.ipc
const store = useStore()
const showDetail = computed(() => store.showDetail)
const navExpand = computed(() => store.navExpand)
</script>

<style scoped lang="scss">
@mixin BackBtn($color) {
  width: 48px;
  margin-right: auto;
  background-color: $color;
}
@mixin TitleBtn($hoverColor, $activeColor) {
  width: 46px;
  -webkit-app-region: no-drag;
  &:hover {
    background-color: $hoverColor;
  }
  &:active {
    background-color: $activeColor;
  }
}
@mixin Stroke($color) {
  svg { stroke: $color; }
}

.KTitleBar {
  height: 30px;
  width: 100%;
  -webkit-app-region: drag;
  display: flex;
  justify-content: flex-end;
  >button {
    height: 100%;
    background-color: transparent;
    border: none;
    svg {
      stroke: #000;
      stroke-width: 1px;
    }
  }
  .BackBtn {
    @include BackBtn(#f2f2f2);
    transition: width .15s;
    &.Expand {
      width: 200px;
      transition: width .15s;
      padding: 0;
      display: flex;
      align-items: center;
      >span {
        margin-left: 17px;
        white-space: nowrap;
      }
    }
    &.Detail {
      @include TitleBtn(#0e4c7b, #1c3d59);
      @include BackBtn(#005a9e);
      @include Stroke(#fff);
    }
  }
  .MinBtn,.MaxBtn{
    @include TitleBtn(#f0f0f0, #d0d0d0);
    svg { shape-rendering: crispEdges;}
    &.Detail {
      @include Stroke(#fff);
      &:hover { @include Stroke(#000); }
      &:active { @include Stroke(#000); }
    }
  }
  .CloseBtn {
    @include TitleBtn(#e81123, #f1707a);
    &.Detail { @include Stroke(#fff); }
    &:hover { @include Stroke(#fff); }
    &:active { @include Stroke(#000); }
  }
}
</style>
