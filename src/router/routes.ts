import type { RouteRecordRaw } from 'vue-router'
import { DefaultTemplate } from '@/template'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    component: DefaultTemplate,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue')
      }
    ]
  },
  // Catch-all / 404 route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes

