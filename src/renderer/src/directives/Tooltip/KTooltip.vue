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
    const dtop = ref(0)
    const dleft = ref(0)
    return { text, show, dtop, dleft }
  }
})
</script>

<style scoped lang="scss">
@import '@renderer/assets/global';
.KTooltip {
  position: fixed;
  top: v-bind('dtop + "px"');
  left: v-bind('dleft + "px"');
  width: max-content;
  transform: translate(-50%, calc(-100% - 10px));
  @include tool-tip;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s;
  padding: 7px 10px;
  display: flex;
  justify-content: center;
  &.visible {
    opacity: 1;
    transition: opacity .2s;
  }
  span {
    font-size: 13px;
    line-height: 13px;
  }
}
</style>
