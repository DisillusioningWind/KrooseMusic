<template>
  <KDrawer>
    <KLibList mode="playlist" :items="store.curList" :cur-path="store.musicPath" />
  </KDrawer>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const store = useStore()
</script>

<style scoped lang="scss">
</style>
