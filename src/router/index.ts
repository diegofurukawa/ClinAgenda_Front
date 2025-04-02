// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Se a rota requer autenticação e o usuário não está logado
  if (requiresAuth && !authStore.isAuthenticated) {
    // Tenta validar o token se existir
    if (authStore.token) {
      const isValid = await authStore.validateToken()
      if (isValid) {
        next()
        return
      }
    }
    // Se não tem token ou token é inválido, redireciona para login
    next('/login')
  } else {
    // Se o usuário está autenticado e tenta acessar a página de login, redireciona para home
    if (to.path === '/login' && authStore.isAuthenticated) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
