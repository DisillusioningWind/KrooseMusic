import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import emitter from './utils/emitter'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
app.config.globalProperties.emitter = emitter
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// Auto preview
// if (process.env.NODE_ENV === 'development') {
//   import("autopreview/vue3").then(({ default: AutoPreview }) => {
//     new AutoPreview("#app", (app) => {
//       app.use(router).use(pinia)
//     })
//   })
// }
app.mount('#app')
