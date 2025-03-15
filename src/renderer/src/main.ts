import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createHotKey } from './services/hotkey'
import persist from 'pinia-plugin-persist'
import PMain from './PMain.vue'
import router from './router'
// 创建Pinia实例并启用持久化
const pinia = createPinia()
pinia.use(persist)
// 创建App实例并挂载
const app = createApp(PMain)
app.use(router)
app.use(pinia)
app.mount('#app')
// 创建快捷键服务
createHotKey()
