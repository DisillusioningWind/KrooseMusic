<template>
  <KDrawer>
    <KLibList mode="playlist" :items="curList" :path="curPath" />
  </KDrawer>
</template>

<script setup lang="ts">
import { useLibStore } from '@renderer/store'
const { curList, curPath } = storeToRefs(useLibStore())
</script>

<style scoped lang="scss">
</style>
