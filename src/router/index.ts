import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes' // Importando como exportação padrão

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth !== false)
  const isAuthenticated = localStorage.getItem('clinagenda_user') !== null

  if (requiresAuth && !isAuthenticated) {
    // Redirect to login page if authentication is required but user is not authenticated
    next({ name: 'login' })
  } else if (to.name === 'login' && isAuthenticated) {
    // Redirect to dashboard if user is already authenticated and tries to access login page
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router

