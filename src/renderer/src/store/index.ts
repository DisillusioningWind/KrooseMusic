import { defineStore } from "pinia"

export const useStore = defineStore({
  id: "main",
  state: () => ({
    showDetail: false,
  })
})
