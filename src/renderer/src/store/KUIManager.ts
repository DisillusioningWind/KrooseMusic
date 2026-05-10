import { defineStore } from 'pinia'

/** 界面状态 */
export const getUIManager = defineStore('store-ui', () => {
  const expandNavi = ref(false) // 展开导航侧栏
  const showDetail = ref(false) // 显示播放详情
  const showDrawer = ref(false) // 显示播放队列

  function switchNavBarState() { expandNavi.value = !expandNavi.value }
  function switchDetailState() { showDetail.value = !showDetail.value }
  function switchDrawerState() { showDrawer.value = !showDrawer.value }

  return {
    /** 展开导航侧栏 */
    expandNavi,
    /** 显示播放详情 */
    showDetail,
    /** 显示播放队列 */
    showDrawer,
    switchNavBarState,
    switchDetailState,
    switchDrawerState,
  }
})
