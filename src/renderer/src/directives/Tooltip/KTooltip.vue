<template>
  <div class="KTooltip" :class="show ? 'visible' : ''">
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  setup() {
    const text = ref('')
    const show = ref(false)
    const top = ref(0)
    const left = ref(0)
    return { text, show, top, left }
  }
})
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';
$tooltip-height: 26px;
.KTooltip {
  position: fixed;
  top: v-bind('top + "px"');
  left: v-bind('left + "px"');
  height: $tooltip-height;
  transform: translate(-50%, calc(-100% - 10px));
  @include tool-tip;
  padding: 0 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
  &.visible {
    opacity: 1;
    transition: opacity .2s;
  }
  span {
    line-height: $tooltip-height;
    white-space: nowrap;
    font-size: 13px;
  }
}
</style>
