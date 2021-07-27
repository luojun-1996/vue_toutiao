import Vue from 'vue'
import VueRouter from 'vue-router'
import { Dialog } from 'vant'
import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: () => import('../views/layout/'),
    children: [
      { path: '', component: () => import('../views/home/'), meta: { requiresAuth: false } },
      { path: '/wd', component: () => import('../views/wd/'), meta: { requiresAuth: false } },
      { path: '/video', component: () => import('../views/video/'), meta: { requiresAuth: false } },
      { path: '/mine', component: () => import('../views/mine/'), meta: { requiresAuth: false } }
    ]
  },
  {
    path: '/search',
    component: () => import('../views/search/'),
    meta: { requiresAuth: false }
  },
  {
    path: '/article/:articleId',
    name: "article",
    component: () => import('../views/article/'),
    props: true,
    meta: { requiresAuth: false }
  },
  {
    path: '/user/profile',
    name: "user-profile",
    component: () => import('../views/user-profile'),
    meta: { requiresAuth: false }
  },
  {
    path: '/user/chat',
    name: "user-chat",
    component: () => import('../views/user-chat'),
    meta: { requiresAuth: true }
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // 校验登录状态
    if (store.state.user) {
      return next()
    }
    Dialog.confirm({
      title: '访问提示',
      message: '该功能需要登录才能访问呢，确认登录吗？'
    }).then(() => {
      // on confirm
      router.replace({
        name: 'login',
        query: {
          redirect: router.currentRoute.fullPath,
        },
      })
    }).catch(() => {
      // on cancel
      next(false)
    })
  } else {
    // 不需要登录状态的页面
    next()
  }
})

export default router
