<template>
  <div>
    <audio :src="fileUrl" controls></audio>
    <el-button type="primary" size="default" @click="openFile">打开文件</el-button>
  </div>
</template>

<script setup lang="ts">

let fileUrl = ref('')

async function openFile() {
  // @ts-ignore
  const buffer = await window.ipc.callMain('open-file')
  if (buffer) {
    fileUrl.value = URL.createObjectURL(new Blob([buffer]))
    console.log('url load success', fileUrl.value)
  }
}
</script>

<style scoped lang="scss">
div {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
