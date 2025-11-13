import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import MainLayout from '@/layouts/MainLayout.vue'
import { useAuthStore } from '@/store/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/',
    component: MainLayout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'menu/menu1',
        name: 'Menu1',
        component: () => import('@/views/Menu1.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'menu/menu2',
        name: 'Menu2',
        component: () => import('@/views/Menu2.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'new-page',
        name: 'NewPage',
        component: () => import('@/views/NewPage.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  // Check authentication status
  if (!authStore.isAuthenticated) {
    authStore.checkAuth()
  }

  // If route requires authentication
  if (to.meta.requiresAuth) {
    if (authStore.isAuthenticated && authStore.user) {
      next()
    } else {
      // Redirect to login with return URL
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  } else if (to.meta.hideForAuth) {
    // If already logged in and trying to access login page
    if (authStore.isAuthenticated && authStore.user) {
      next('/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router

