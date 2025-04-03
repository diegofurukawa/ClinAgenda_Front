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
        path: '/',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue')
      },
      // Status Management routes
      {
        path: 'status',
        name: 'status-list',
        component: () => import('@/pages/status/StatusListPage.vue')
      },
      {
        path: 'status/create',
        name: 'status-create',
        component: () => import('@/pages/status/StatusFormPage.vue')
      },
      {
        path: 'status/:id',
        name: 'status-edit',
        component: () => import('@/pages/status/StatusFormPage.vue'),
        props: true
      },

      // Specialty Management routes
      {
        path: 'specialty',
        name: 'specialty-list',
        component: () => import('@/pages/specialty/SpecialtyListPage.vue')
      },
      {
        path: 'specialty/create',
        name: 'specialty-create',
        component: () => import('@/pages/specialty/SpecialtyFormPage.vue')
      },
      {
        path: 'specialty/:id',
        name: 'specialty-edit',
        component: () => import('@/pages/specialty/SpecialtyFormPage.vue'),
        props: true
      },

      // Patient Management routes
      {
        path: 'patient',
        name: 'patient-list',
        component: () => import('@/pages/patient/PatientListPage.vue')
      },
      {
        path: 'patient/create',
        name: 'patient-create',
        component: () => import('@/pages/patient/PatientFormPage.vue')
      },
      {
        path: 'patient/:id',
        name: 'patient-edit',
        component: () => import('@/pages/patient/PatientFormPage.vue'),
        props: true
      }
      // Other protected routes can be added here
    ]
  },
  // Fallback route
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export default routes

