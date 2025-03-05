import { createRouter, createWebHashHistory } from 'vue-router'

import PMain from '@renderer/pages/PMain/PMain.vue'
import PLibrary from '@renderer/pages/PLibrary/PLibrary.vue'
const PLike = () => import('@renderer/pages/PLike/PLike.vue')
const PList = () => import('@renderer/pages/PList/PList.vue')
const PSearch = () => import('@renderer/pages/PSearch/PSearch.vue')
const PSetting = () => import('@renderer/pages/PSetting/PSetting.vue')

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    component: PMain,
    children: [
      { path: 'Library', component: PLibrary },
      { path: 'Like', component: PLike },
      { path: 'List', component: PList },
      { path: 'Search', component: PSearch, props: route => ({ query: route.query.search }) },
      { path: 'Setting', component: PSetting }
    ]
  }]
})

export default router
