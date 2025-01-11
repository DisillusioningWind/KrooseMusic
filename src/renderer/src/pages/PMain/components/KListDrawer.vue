<template>
  <KDrawer>
    <KLibList mode="playlist" :items="curList" :cur-path="mscPath" />
  </KDrawer>
</template>

<script setup lang="ts">
import { useStore, useInfoStore } from '@renderer/store'
const { curList } = storeToRefs(useStore())
const { mscPath } = storeToRefs(useInfoStore())
</script>

<style scoped lang="scss">
</style>
