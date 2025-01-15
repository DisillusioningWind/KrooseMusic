<template>
  <KDrawer>
    <KLibList mode="playlist" :items="curList" :path="curMsc?.path" />
  </KDrawer>
</template>

<script setup lang="ts">
import { useStore } from '@renderer/store'
const { curList, curMsc } = storeToRefs(useStore())
</script>

<style scoped lang="scss">
</style>
