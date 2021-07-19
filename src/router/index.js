import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/login', component: () => import('../views/login/') },
  {
    path: '/',
    component: () => import('../views/layout/'),
    children: [
      { path: '', component: () => import('../views/home/') },
      { path: '/wd', component: () => import('../views/wd/') },
      { path: '/video', component: () => import('../views/video/') },
      { path: '/mine', component: () => import('../views/mine/') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
