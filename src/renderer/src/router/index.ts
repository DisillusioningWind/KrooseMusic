import { createRouter, createWebHashHistory } from 'vue-router'

import PMain from '@renderer/pages/PMain.vue'
import PLibrary from '@renderer/pages/PLibrary.vue'
import PLike from '@renderer/pages/PLike.vue'
import PList from '@renderer/pages/PList.vue'
import PSearch from '@renderer/pages/PSearch.vue'
import PSetting from '@renderer/pages/PSetting.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [{
    path: '/',
    component: PMain,
    children: [{
        path: 'Library',
        component: PLibrary
      }, {
        path: 'Like',
        component: PLike
      }, {
        path: 'List',
        component: PList
      }, {
        path: 'Search',
        component: PSearch
      }, {
        path: 'Setting',
        component: PSetting
      }
    ]
  }]
})

export default router
