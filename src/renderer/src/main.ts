import { createApp } from 'vue'
import { createPinia } from 'pinia'
import persist from 'pinia-plugin-persist'
import App from './App.vue'
import router from './router'

const pinia = createPinia()
pinia.use(persist)

const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#kApp')
