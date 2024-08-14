<template>
  <div class="KSettingItem">
    <p class="Title">{{ title }}</p>
    <div class="Content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
export default defineComponent({
  props: {
    title: String
  },
  setup(props) {
    return { title: props.title }
  }
})
</script>

<style scoped lang="scss">
$title-size: 25px;
.KSettingItem {
  .Title {
    font-size: $title-size;
    line-height: $title-size;
  }
  .Content {
    margin-top: 16px;
  }
}
</style>
