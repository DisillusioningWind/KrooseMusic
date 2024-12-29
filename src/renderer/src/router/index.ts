import { createRouter, createWebHashHistory } from 'vue-router'

import PMain from '@renderer/pages/PMain/PMain.vue'
import PLibrary from '@renderer/pages/PLibrary/PLibrary.vue'
import PLike from '@renderer/pages/PLike/PLike.vue'
import PList from '@renderer/pages/PList/PList.vue'
import PSearch from '@renderer/pages/PSearch/PSearch.vue'
import PSetting from '@renderer/pages/PSetting/PSetting.vue'

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
