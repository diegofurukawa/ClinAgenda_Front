// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  console.log(
    'Navigation guard - Route:',
    to.path,
    'Authentication status:',
    authStore.isAuthenticated
  )

  // Check if route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // If path is login and user is authenticated, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    console.log('Usuário já autenticado, redirecionando para dashboard')
    return { name: 'dashboard' }
  }

  // If route doesn't require auth, allow navigation
  if (!requiresAuth) {
    console.log('Testando next')
    return true
  }

  // Check if user is authenticated
  const isAuthenticated = authStore.isAuthenticated

  // If route requires authentication but user is not authenticated, redirect to login
  if (requiresAuth && !isAuthenticated) {
    // Store the intended destination to redirect after login
    localStorage.setItem('clinagenda_redirect_after_login', to.fullPath)

    toastStore.setToast({
      type: 'warning',
      text: 'Por favor, faça login para acessar essa página.'
    })

    console.log('Redirecionando para login - Autenticação necessária')
    return { path: '/login' }
  }

  // Allow navigation for authenticated users
  return true
})

// After each navigation (for analytics or other purposes)
router.afterEach((to) => {
  // Set page title based on route meta
  document.title = to.meta.title
    ? `${to.meta.title} - ClinAgenda`
    : 'ClinAgenda - Recepção de Pacientes'

  // Can be used for analytics or other post-navigation tasks
  // sendToAnalytics(to.fullPath)
})

export default router

