import { createRouter, createWebHashHistory } from 'vue-router'

import Main from '@renderer/pages/Main.vue'
import Library from '@renderer/pages/Library.vue'
import Like from '@renderer/pages/Like.vue'
import List from '@renderer/pages/List.vue'
import Search from '@renderer/pages/Search.vue'
import Setting from '@renderer/pages/Setting.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Main,
      children: [
        {
          path: 'Library',
          component: Library
        },
        {
          path: 'Like',
          component: Like
        },
        {
          path: 'List',
          component: List
        },
        {
          path: 'Search',
          component: Search
        },
        {
          path: 'Setting',
          component: Setting
        }
      ]
    }
  ]
})

export default router
