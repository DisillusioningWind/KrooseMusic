import { defineStore } from "pinia"

export const useStore = defineStore({
  id: "main",
  state: () => ({
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
