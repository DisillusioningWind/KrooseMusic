import { defineStore } from "pinia"
import db from '@renderer/utils/db'

export const useStore = defineStore('main', () => {
  const navExpand = ref(false)
  const showDetail = ref(false)
  const showDrawer = ref(false)
  const curLibs = shallowRef<ILibrary[]>([])
  const curLib = ref<ILibrary>()
  const curItems = shallowRef<ILibItem[]>([])
  const curItem = computed(() => curItems.value.find(item => item.path===(curLib.value?.mode==='normal'?musicPath.value:albumPath.value)))
  const curList = shallowRef<ILibItem[]>([])
  const albumPath = ref('')
  const musicPath = ref('')
  const musicPicURL = ref('')
  const musicLyrics = shallowRef<ILyric[]>([])
  const musicCurTime = ref(0)

  watch(curLib, async (curLib) => {
    if (!curLib) return
    const cnt = await db.getItemNums(curLib.name)
    const size = 500
    const res = [] as ILibItem[]
    for (let i = 0; i < cnt; i += size) { res.push(...await db.getItems(curLib.name, i, size)) }
    curItems.value = res
  })
  watch(curList, async (curList) => {
    await db.clearItems('curlist')
    await db.addItems('curlist', curList)
  })

  function toggleDetail() { showDetail.value = !showDetail.value }
  function toggleDrawer() { showDrawer.value = !showDrawer.value }

  return {
    navExpand,
    showDetail,
    showDrawer,
    curLibs,
    curLib,
    curItems,
    curItem,
    curList,
    albumPath,
    musicPath,
    musicPicURL,
    musicLyrics,
    musicCurTime,
    toggleDetail,
    toggleDrawer,
  }
})
