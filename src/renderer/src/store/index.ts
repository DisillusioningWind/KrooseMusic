import { defineStore } from "pinia"

export const useStore = defineStore({
  id: "main",
  state: () => ({
    /** 导航栏最大化 */
    navExpand: false,
    /** 显示详情界面 */
    showDetail: false,
    musicPicURL: '',
    musicLyrics: [] as ILyric[],
    musicCurTime: 0,
  }),
  actions: {
    toggleDetail() {
      this.showDetail = !this.showDetail
    },
  }
})
