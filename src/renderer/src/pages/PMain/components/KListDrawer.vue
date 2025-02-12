<template>
  <KDrawer v-model="showDrawer">
    <KLibList mode="playlist" :items="curList" :path="curPath" />
  </KDrawer>
</template>

<script setup lang="ts">
import { useUIStore } from '@renderer/store'
import { useLibStore } from '@renderer/store'
const { showDrawer } = storeToRefs(useUIStore())
const { curList, curPath } = storeToRefs(useLibStore())
</script>

<style scoped lang="scss">
</style>
