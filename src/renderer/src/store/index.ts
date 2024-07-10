import { defineStore } from "pinia"

export const useStore = defineStore({
  id: "main",
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++
    },
  },
})
