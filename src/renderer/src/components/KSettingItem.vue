<template>
  <div class="KSettingItem">
    <p class="Title">{{ title }}</p>
    <div class="Content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped lang="scss">
$title-size: 25px;
.KSettingItem {
  .Title {
    font-size: $title-size;
    line-height: $title-size;
    user-select: none;
  }
  .Content {
    margin-top: 16px;
  }
}
</style>
