import type { RouteRecordRaw } from 'vue-router'
import { PageMode } from '@/enum'

// Pages
import HomePage from '@/pages/home/HomePage.vue'
import DashboardPage from '@/pages/dashboard/DashboardPage.vue'
import LoginPage from '@/pages/auth/LoginPage.vue'
import NotFoundPage from '@/pages/notfound/NotFoundPage.vue'

import StatusListPage from '@/pages/status/StatusListPage.vue'
import StatusFormPage from '@/pages/status/StatusFormPage.vue'

// Get user info from the auth store
import SpecialtyListPage from '@/pages/specialty/SpecialtyListPage.vue'
import SpecialtyFormPage from '@/pages/specialty/SpecialtyFormPage.vue'

import PatientListPage from '@/pages/patient/PatientListPage.vue'
import PatientFormPage from '@/pages/patient/PatientFormPage.vue'

import DoctorListPage from '@/pages/doctor/DoctorListPage.vue'
import DoctorFormPage from '@/pages/doctor/DoctorFormPage.vue'

export const routes: Array<RouteRecordRaw> = [
  // Rotas que usam DefaultTemplate
  {
    path: '/',
    name: 'home',
    component: HomePage,
    meta: {
      requiresAuth: true,
      title: 'Home',
      layout: 'default'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardPage,
    meta: {
      requiresAuth: true,
      title: 'Dashboard',
      layout: 'default'
    }
  },
  {
    path: '/status',
    name: 'status-list',
    component: StatusListPage,
    meta: {
      requiresAuth: true,
      title: 'Status',
      layout: 'default'
    }
  },
  {
    path: '/status/insert',
    name: 'status-insert',
    component: StatusFormPage,
    meta: {
      requiresAuth: true,
      title: 'Novo Status',
      mode: PageMode.PAGE_INSERT,
      layout: 'default'
    }
  },
  {
    path: '/status/:id',
    name: 'status-update',
    component: StatusFormPage,
    meta: {
      requiresAuth: true,
      title: 'Editar Status',
      mode: PageMode.PAGE_UPDATE,
      layout: 'default'
    }
  },
  {
    path: '/specialty',
    name: 'specialty-list',
    component: SpecialtyListPage,
    meta: {
      requiresAuth: true,
      title: 'Especialidades',
      layout: 'default'
    }
  },
  {
    path: '/specialty/insert',
    name: 'specialty-insert',
    component: SpecialtyFormPage,
    meta: {
      requiresAuth: true,
      title: 'Nova Especialidade',
      mode: PageMode.PAGE_INSERT,
      layout: 'default'
    }
  },
  {
    path: '/specialty/:id',
    name: 'specialty-update',
    component: SpecialtyFormPage,
    meta: {
      requiresAuth: true,
      title: 'Editar Especialidade',
      mode: PageMode.PAGE_UPDATE,
      layout: 'default'
    }
  },
  {
    path: '/patient',
    name: 'patient-list',
    component: PatientListPage,
    meta: {
      requiresAuth: true,
      title: 'Pacientes',
      layout: 'default'
    }
  },
  {
    path: '/patient/insert',
    name: 'patient-insert',
    component: PatientFormPage,
    meta: {
      requiresAuth: true,
      title: 'Novo Paciente',
      mode: PageMode.PAGE_INSERT,
      layout: 'default'
    }
  },
  {
    path: '/patient/:id',
    name: 'patient-update',
    component: PatientFormPage,
    meta: {
      requiresAuth: true,
      title: 'Editar Paciente',
      mode: PageMode.PAGE_UPDATE,
      layout: 'default'
    }
  },
  {
    path: '/doctor',
    name: 'doctor-list',
    component: DoctorListPage,
    meta: {
      requiresAuth: true,
      title: 'Médicos',
      layout: 'default'
    }
  },
  {
    path: '/doctor/insert',
    name: 'doctor-insert',
    component: DoctorFormPage,
    meta: {
      requiresAuth: true,
      title: 'Novo Médico',
      mode: PageMode.PAGE_INSERT,
      layout: 'default'
    }
  },
  {
    path: '/doctor/:id',
    name: 'doctor-update',
    component: DoctorFormPage,
    meta: {
      requiresAuth: true,
      title: 'Editar Médico',
      mode: PageMode.PAGE_UPDATE,
      layout: 'default'
    }
  },
  // Rotas sem DefaultTemplate
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

