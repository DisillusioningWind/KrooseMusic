<template>
  <div class="KTitleBar-Wrapper">
    <button class="Button-Back" :class=" showDetail ? 'Button-Back-Detail' : ''" @click="store.toggleDetail()">
      <svg height="100%" width="100%" v-show="showDetail">
        <line x1="31%" y1="50%" x2="68%" y2="50%"/>
        <line x1="31%" y1="50%" x2="46%" y2="34%"/>
        <line x1="31%" y1="50%" x2="46%" y2="66%"/>
      </svg>
    </button>
    <button class="Button-Min" :class=" showDetail ? 'Button-Min-Detail' : ''" @click="ipc.callMain('minWindow')">
      <svg height="100%" width="100%">
        <line x1="35%" y1="50%" x2="65%" y2="50%"/>
      </svg>
    </button>
    <button class="Button-Max" :class=" showDetail ? 'Button-Max-Detail' : ''" @click="ipc.callMain('maxWindow')">
      <svg height="100%" width="100%">
        <rect x="34%" y="32%" width="28%" height="36%" fill="transparent"/>
      </svg>
    </button>
    <button class="Button-Close" :class=" showDetail ? 'Button-Close-Detail' : ''" @click="ipc.callMain('closeWindow')">
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
</script>

<style scoped lang="scss">
@mixin BackButtonStyle($color) {
  background-color: $color;
  justify-self: flex-start;
  margin-right: auto;
  width: 48px;
}
@mixin WindowButtonStyle($hoverColor, $activeColor) {
  -webkit-app-region: no-drag;
  width: 46px;
  &:hover {
    background-color: $hoverColor;
  }
  &:active {
    background-color: $activeColor;
  }
}

.KTitleBar-Wrapper {
  height: 100%;
  width: 100%;
  -webkit-app-region: drag;
  display: flex;
  justify-content: flex-end;
  button {
    height: 100%;
    background-color: transparent;
    border: none;
    svg {
      stroke: #000;
      stroke-width: 1px;
    }
  }
  .Button-Back {
    @include BackButtonStyle(#f2f2f2);
  }
  .Button-Back-Detail {
    @include WindowButtonStyle(#0e4c7b, #1c3d59);
    @include BackButtonStyle(#005a9e);
    svg { stroke: #fff; }
  }
  .Button-Min,.Button-Max{
    svg { shape-rendering: crispEdges;}
    @include WindowButtonStyle(#f0f0f0, #d0d0d0);
  }
  .Button-Min-Detail,.Button-Max-Detail {
    svg { stroke: #fff; }
    &:hover { svg { stroke: #000; } }
    &:active { svg { stroke: #000; } }
  }
  .Button-Close {
    @include WindowButtonStyle(#e81123, #f1707a);
    &:hover { svg { stroke: #fff; } }
    &:active { svg { stroke: #000; } }
  }
  .Button-Close-Detail {
    svg { stroke: #fff; }
  }
}
</style>
