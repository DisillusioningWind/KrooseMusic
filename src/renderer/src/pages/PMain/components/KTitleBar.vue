<template>
  <div class="KTitleBar">
    <button class="back" :class="showDetail?'detail':(navExpand?'expand':'')" @click="btnChangeDetail">
      <span v-show="navExpand && !showDetail">Kroose 音乐</span>
      <svg v-show="showDetail" height="100%" width="100%">
        <line x1="31%" y1="50%" x2="68%" y2="50%"/>
        <line x1="31%" y1="50%" x2="46%" y2="34%"/>
        <line x1="31%" y1="50%" x2="46%" y2="66%"/>
      </svg>
    </button>
    <button class="min" :class="showDetail?'detail':''" @click="btnChangeWindow('min')">
      <svg height="100%" width="100%">
        <line x1="35%" y1="50%" x2="65%" y2="50%"/>
      </svg>
    </button>
    <button class="max" :class="showDetail?'detail':''" @click="btnChangeWindow('max')">
      <svg height="100%" width="100%">
        <rect x="34%" y="32%" width="28%" height="36%" fill="transparent"/>
      </svg>
    </button>
    <button class="close" :class="showDetail?'detail':''" @click="btnChangeWindow('close')">
      <svg height="100%" width="100%">
        <line x1="36%" y1="34%" x2="64%" y2="66%"/>
        <line x1="64%" y1="34%" x2="36%" y2="66%"/>
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
import bus from '@renderer/utils/emitter'
const { showDetail, navExpand } = storeToRefs(useStore())
function btnChangeDetail() { bus.emChangeDetailState() }
function btnChangeWindow(type: string) {
  switch (type) {
    case 'min': window.api.minWindow(); break
    case 'max': window.api.maxWindow(); break
    case 'close': window.api.closeWindow(); break
  }
}
</script>

<style scoped lang="scss">
@mixin k-title-btn($hoverColor, $activeColor) {
  width: 46px;
  -webkit-app-region: no-drag;
  &:hover { background-color: $hoverColor; }
  &:active { background-color: $activeColor; }
}
@mixin k-back-btn($color) {
  width: 48px;
  margin-right: auto;
  background-color: $color;
}
@mixin k-stroke($color) {
  svg { stroke: $color; }
}

.KTitleBar {
  height: 30px;
  width: 100%;
  -webkit-app-region: drag;
  z-index: 1;
  display: flex;
  justify-content: flex-end;
  >button {
    height: 100%;
    background-color: transparent;
    border: none;
    >svg {
      stroke: #000;
      stroke-width: 1px;
    }
  }
  .back {
    @include k-back-btn(#f2f2f2);
    transition: width .15s, background-color .4s;
    &.expand {
      width: 200px;
      padding: 0;
      display: flex;
      align-items: center;
      >span {
        margin-left: 17px;
        white-space: nowrap;
      }
    }
    &.detail {
      @include k-title-btn(#0e4c7b, #1c3d59);
      @include k-back-btn(#005a9e);
      @include k-stroke(#fff);
    }
  }
  .min {
    @extend .max;
    svg { stroke-width: 0.5px; }
  }
  .max{
    @include k-title-btn(#f0f0f0, #d0d0d0);
    svg { shape-rendering: crispEdges;}
    &.detail {
      @include k-stroke(#fff);
      &:hover { @include k-stroke(#000); }
      &:active { @include k-stroke(#000); }
    }
  }
  .close {
    @include k-title-btn(#e81123, #f1707a);
    &.detail { @include k-stroke(#fff); }
    &:hover { @include k-stroke(#fff); }
    &:active { @include k-stroke(#000); }
  }
}
</style>
