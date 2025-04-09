// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/routes'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const toastStore = useToastStore()

  console.log(
    'Navigation guard - Route:',
    to.path,
    'Authentication status:',
    authStore.isAuthenticated
  )

  // If path is login and user is authenticated, redirect to dashboard
  if (to.path === '/login' && authStore.isAuthenticated) {
    console.log('Usuário já autenticado, redirecionando para dashboard')
    return { name: 'dashboard' }
  }

  // Check if route requires authentication
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // If route doesn't require auth, allow navigation
  if (!requiresAuth) {
    console.log('Rota não requer autenticação')
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

  // Check for role-based access control if roles are specified
  const requiredRoles = to.meta.roles as string[] | undefined
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => authStore.hasRole(role))

    if (!hasRequiredRole) {
      toastStore.setToast({
        type: 'error',
        text: 'Você não tem permissão para acessar esta página.'
      })

      return { name: 'dashboard' }
    }
  }

  // Allow navigation for authenticated users
  return true
})

// After each navigation
router.afterEach((to) => {
  // Set page title based on route meta
  document.title = to.meta.title
    ? `${to.meta.title} - ClinAgenda`
    : 'ClinAgenda - Recepção de Pacientes'

  // Scroll to top after navigation
  window.scrollTo(0, 0)
})

export default router

