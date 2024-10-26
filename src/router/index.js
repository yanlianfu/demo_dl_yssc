import { createRouter, createWebHistory } from 'vue-router'
import ResourceManagement from '../views/ResourceManagement.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: ResourceManagement
    }
  ]
})

export default router