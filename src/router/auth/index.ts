// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from '@/router/auth/Routes'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { h } from 'vue'
import DefaultTemplate from '@/template/DefaultTemplate.vue'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Renderizar componentes dentro do DefaultTemplate quando necessário
router.beforeResolve((to, from, next) => {
  // Se a rota possui o meta layout configurado como 'default'
  if (to.meta.layout === 'default' && to.matched.length > 0) {
    // Verificamos se matched[0] existe e se components existe
    const firstMatched = to.matched[0]

    if (firstMatched && firstMatched.components) {
      const actualComponent = firstMatched.components.default

      // Só faz o wrapping se tivermos um componente real
      if (actualComponent) {
        firstMatched.components.default = {
          render() {
            return h(
              DefaultTemplate,
              {},
              {
                default: () => h(actualComponent),
                title: () => h('span', {}, (to.meta.title as string) || 'ClinAgenda')
                // Podemos adicionar outros slots conforme necessário
              }
            )
          }
        }
      }
    }
  }
  next()
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

