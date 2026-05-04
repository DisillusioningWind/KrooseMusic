import { defineStore } from 'pinia'

/** 界面状态 */
export const useUIStore = defineStore('store-ui', () => {
  const navExpand = ref(false)// 导航栏展开状态
  const showDetail = ref(false)// 显示播放详情页面
  const showDrawer = ref(false)// 显示播放列表抽屉

  function switchDetailState() {
    showDetail.value = !showDetail.value
  }
  function switchDrawerState() {
    showDrawer.value = !showDrawer.value
  }

  return {
    /** 导航栏展开状态 */ navExpand,
    /** 显示播放详情页面 */ showDetail,
    /** 显示播放列表抽屉 */ showDrawer,
    switchDetailState,
    switchDrawerState
  }
})
