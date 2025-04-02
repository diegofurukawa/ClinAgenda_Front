// src/router/routes.ts
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
      // Outras rotas protegidas aqui
    ]
  },
  // Rota de fallback
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes
