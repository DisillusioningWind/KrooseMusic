<template>
  <div>
    <h1>Search Result: {{ query }}</h1>
  </div>
</template>

<script setup lang="ts">
defineProps<{ query: string }>()// 路由参数
</script>

<style>
</style>
