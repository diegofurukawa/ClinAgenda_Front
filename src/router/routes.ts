import type { RouteRecordRaw } from 'vue-router'
import { PageMode } from '@/enum'

// Pages
import HomePage from '@/pages/home/HomePage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import NotFoundPage from '@/pages/notfound/NotFoundPage.vue'

import StatusListPage from '@/pages/status/StatusListPage.vue'
import StatusFormPage from '@/pages/status/StatusFormPage.vue'

import SpecialtyListPage from '@/pages/specialty/SpecialtyListPage.vue'
import SpecialtyFormPage from '@/pages/specialty/SpecialtyFormPage.vue'

import PatientListPage from '@/pages/patient/PatientListPage.vue'
import PatientFormPage from '@/pages/patient/PatientFormPage.vue'

import DoctorListPage from '@/pages/doctor/DoctorListPage.vue'
import DoctorFormPage from '@/pages/doctor/DoctorFormPage.vue'

// Templates
import DefaultTemplate from '@/template/DefaultTemplate.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: DefaultTemplate,
    children: [
      {
        path: '/',
        name: 'home',
        component: HomePage,
        meta: {
          requiresAuth: true,
          title: 'Home'
        }
      },

      {
        path: '/dashboard',
        name: 'dashboard',
        component: DashboardPage,
        meta: {
          requiresAuth: true,
          title: 'Dashboard'
        }
      },

      {
        path: '/status',
        name: 'status-list',
        component: StatusListPage,
        meta: {
          requiresAuth: true,
          title: 'Status'
        }
      },
      {
        path: '/status/:id',
        name: 'status-update',
        component: StatusFormPage,
        meta: {
          requiresAuth: true,
          title: 'Status Update',
          mode: PageMode.PAGE_UPDATE
        }
      },

      {
        path: 'specialty',
        name: 'specialty-list',
        component: SpecialtyListPage,
        meta: {
          requiresAuth: true,
          title: 'Especialidades'
        }
      },
      {
        path: '/specialty/:id',
        name: 'specialty-update',
        component: SpecialtyFormPage,
        meta: {
          requiresAuth: true,
          title: 'Especialidade Update',
          mode: PageMode.PAGE_UPDATE
        }
      },
      {
        path: '/patient',
        name: 'patient-list',
        component: PatientListPage,
        meta: {
          requiresAuth: true,
          title: 'Pacientes'
        }
      },
      {
        path: '/patient/:id',
        name: 'patient-update',
        component: PatientFormPage,
        meta: {
          requiresAuth: true,
          title: 'Paciente Update',
          mode: PageMode.PAGE_UPDATE
        }
      },
      {
        path: '/doctor',
        name: 'doctor-list',
        component: DoctorListPage,
        meta: {
          requiresAuth: true,
          title: 'Médicos'
        }
      },
      {
        path: '/doctor/:id',
        name: 'doctor-update',
        component: DoctorFormPage,
        meta: {
          requiresAuth: true,
          title: 'Médico Update',
          mode: PageMode.PAGE_UPDATE
        }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: {
      title: 'Login'
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundPage,
    meta: {
      title: 'Página não encontrada'
    }
  }
]

export default routes

