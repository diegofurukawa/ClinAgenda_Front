// src/router/routes.ts
import type { RouteRecordRaw } from 'vue-router'

// Define route metadata including roles and page titles
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: {
      requiresAuth: false,
      title: 'Login'
    }
  },
  {
    path: '/',
    component: () => import('@/template/DefaultTemplate.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('@/pages/dashboard/DashboardPage.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true
        }
      },

      // Status Management routes
      {
        path: 'status',
        name: 'status-list',
        component: () => import('@/pages/status/StatusListPage.vue'),
        meta: {
          title: 'Lista de Status',
          requiresAuth: true,
          roles: ['admin'] // Only admin can access
        }
      },
      {
        path: 'status/insert',
        name: 'status-insert',
        component: () => import('@/pages/status/StatusFormPage.vue'),
        meta: {
          title: 'Adicionar Status',
          requiresAuth: true,
          roles: ['admin']
        }
      },
      {
        path: 'status/update/:id',
        name: 'status-update',
        component: () => import('@/pages/status/StatusFormPage.vue'),
        props: true,
        meta: {
          title: 'Editar Status',
          requiresAuth: true,
          roles: ['admin']
        }
      },

      // Specialty Management routes
      {
        path: 'specialty',
        name: 'specialty-list',
        component: () => import('@/pages/specialty/SpecialtyListPage.vue'),
        meta: {
          title: 'Lista de Especialidades',
          requiresAuth: true
        }
      },
      {
        path: 'specialty/insert',
        name: 'specialty-insert',
        component: () => import('@/pages/specialty/SpecialtyFormPage.vue'),
        meta: {
          title: 'Adicionar Especialidade',
          requiresAuth: true,
          roles: ['admin']
        }
      },
      {
        path: 'specialty/update/:id',
        name: 'specialty-update',
        component: () => import('@/pages/specialty/SpecialtyFormPage.vue'),
        props: true,
        meta: {
          title: 'Editar Especialidade',
          requiresAuth: true,
          roles: ['admin']
        }
      },

      // Patient Management routes
      {
        path: 'patient',
        name: 'patient-list',
        component: () => import('@/pages/patient/PatientListPage.vue'),
        meta: {
          title: 'Lista de Pacientes',
          requiresAuth: true
        }
      },
      {
        path: 'patient/insert',
        name: 'patient-insert',
        component: () => import('@/pages/patient/PatientFormPage.vue'),
        meta: {
          title: 'Adicionar Paciente',
          requiresAuth: true
        }
      },
      {
        path: 'patient/update/:id',
        name: 'patient-update',
        component: () => import('@/pages/patient/PatientFormPage.vue'),
        props: true,
        meta: {
          title: 'Editar Paciente',
          requiresAuth: true
        }
      },

      // Doctor Management routes
      {
        path: 'doctor',
        name: 'doctor-list',
        component: () => import('@/pages/doctor/DoctorListPage.vue'),
        meta: {
          title: 'Lista de Médicos',
          requiresAuth: true
        }
      },
      {
        path: 'doctor/insert',
        name: 'doctor-insert',
        component: () => import('@/pages/doctor/DoctorFormPage.vue'),
        meta: {
          title: 'Adicionar Médico',
          requiresAuth: true,
          roles: ['admin']
        }
      },
      {
        path: 'doctor/update/:id',
        name: 'doctor-update',
        component: () => import('@/pages/doctor/DoctorFormPage.vue'),
        props: true,
        meta: {
          title: 'Editar Médico',
          requiresAuth: true,
          roles: ['admin']
        }
      }
    ]
  },

  // Page not found - 404
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/notfound/NotFoundPage.vue'),
    meta: {
      title: 'Página não encontrada',
      requiresAuth: false
    }
  }
]

export default routes

