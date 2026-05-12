<template>
  <div class="PSearch">
    <div class="title">
      <span>搜索结果</span>
    </div>
    <div class="content">
      <KLibList class="searchList" :mode="curLib?.mode" :items="items" :path="playMusic?.path" @select="onItemSelect" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getLibraryManager, getSessionManager, getAudioManager } from '@renderer/store'

const audioManager = getAudioManager()
const sessionManager = getSessionManager()
const { curLib } = storeToRefs(getLibraryManager())
const { playMusic, playAlbum } = storeToRefs(sessionManager)
const props = defineProps<{ query: string }>() // 路由参数
const items = ref<ILibItem[]>([])

watch(() => props.query, async query => {
  if (query && curLib.value) {
    items.value = await window.api.db.searchLibItems(curLib.value.id, query)
    console.info('search success')
  }
}, { immediate: true })

async function onItemSelect(idx: number) {
  if (!curLib.value) {
    return
  }
  const selectItem = items.value[idx]

  if (curLib.value.mode === 'normal') {
    if (playMusic.value?.path === selectItem.path) {
      return
    }

    sessionManager.updatePlayQueue(items.value.slice(idx))
    audioManager.load(selectItem.path)
  } else if (curLib.value.mode === 'asmr') {
    playAlbum.value = selectItem as ILibAlbum
    const direc = await window.api.scan.getDirStruc(selectItem.path)
    direc && sessionManager.updatePlayQueue(direc.mscs)
    direc && audioManager.load(direc.mscs[0].path)
  }
}

</script>

<style>
</style>
