<template>
  <div class="KSetting">
    <p class="title">{{ title }}</p>
    <div class="content"><slot></slot></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<style scoped lang="scss">
$title-size: 25px;
$margin-top: 13px;

.KSetting {
  width: 500px;
  .title {
    font-size: $title-size;
    line-height: $title-size;
    user-select: none;
  }
  .content { margin-top: $margin-top; }
}
</style>
