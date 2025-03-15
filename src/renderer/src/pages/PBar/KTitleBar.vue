<template>
  <div class="KTitleBar">
    <button class="bak" :class="{ detail: showDetail, expand: !showDetail&&navExpand }" @click="btnChangeDetail">
      <span class="txt" v-show="navExpand&&!showDetail">Kroose 音乐</span>
      <svg class="ico" v-show="showDetail" height="100%" width="100%">
        <line x1="34%" y1="50%" x2="62%" y2="50%" />
        <line x1="34%" y1="50%" x2="46%" y2="34%" />
        <line x1="34%" y1="50%" x2="46%" y2="66%" />
      </svg>
    </button>
    <button class="min" :class="{ detail: showDetail }" @click="btnMinWindow">
      <svg class="ico" height="100%" width="100%" shape-rendering="crispEdges">
        <line x1="38%" y1="50%" x2="62%" y2="50%" />
      </svg>
    </button>
    <button class="max" :class="{ detail: showDetail }" @click="btnMaxWindow">
      <svg class="ico" height="100%" width="100%" stroke-width="0.5" shape-rendering="crispEdges">
        <rect x="38%" y="33%" width="22%" height="32%" fill="transparent" />
      </svg>
    </button>
    <button class="cls" :class="{ detail: showDetail }" @click="btnCloseWindow">
      <svg class="ico" height="100%" width="100%">
        <line x1="39%" y1="34%" x2="61%" y2="66%" />
        <line x1="61%" y1="34%" x2="39%" y2="66%" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useUIStore } from '@renderer/store'
import bus from '@renderer/utils/emitter'
const { showDetail, navExpand } = storeToRefs(useUIStore())
function btnChangeDetail() { bus.emChangeDetailState() }
function btnMinWindow() { window.api.minWindow() }
function btnMaxWindow() { window.api.maxWindow() }
function btnCloseWindow() { window.api.closeWindow() }
</script>

<style scoped lang="scss">
@mixin k-title-btn($hov, $act, $ico-hov: #fff, $ico-act: #000, $col: transparent, $wid: 46px) {
  -webkit-app-region: no-drag;
  height: 100%;
  width: $wid;
  border: none;
  background-color: $col;
  >.ico { stroke: #000; }
  &.detail>.ico { stroke: #fff; }
  &:hover {
    background-color: $hov;
    >.ico { stroke: $ico-hov; }
  }
  &:active {
    background-color: $act;
    >.ico { stroke: $ico-act; }
  }
}

.KTitleBar {
  z-index: 1;
  -webkit-app-region: drag;
  height: 30px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  >.bak {
    width: 48px;
    margin-right: auto;
    border: none;
    background-color: #f2f2f2;
    transition: width .15s, background-color .4s;
    &.detail { @include k-title-btn(#0e4c7b, #1c3d59, #fff, #fff, #005a9e, 48px); }
    &.expand {
      width: 200px;
      display: flex;
      align-items: center;
      padding-left: 16px;
      >.txt { white-space: nowrap; }
    }
  }
  >.min, >.max { @include k-title-btn(#f0f0f0, #d0d0d0, #000, #000); }
  >.cls { @include k-title-btn(#e81123, #f1707a); }
}
</style>
