import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// Auto preview
import AutoPreviewForVue from 'autopreview/vue3'
if (process.env.NODE_ENV === 'development') {
  new AutoPreviewForVue("#app", (app) => {
    app.use(router)
  })
}

const app = createApp(App)
const pinia = createPinia()
app.use(router)
app.use(pinia)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.mount('#app')
