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
  },
  { path: '/search', component: () => import('../views/search/') },
  { path: '/article/:articleId', name: "article", component: () => import('../views/article/'), props: true },
  { path: '/user/profile', name: "user-profile", component: () => import('../views/user-profile') }
]

const router = new VueRouter({
  routes
})

export default router
