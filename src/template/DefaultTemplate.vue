<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import ClinicToast from '@/components/ClinicToast.vue'
import { mdiAccountTag, mdiGroup, mdiHome, mdiPacMan, mdiDoctor, mdiTag } from '@mdi/js'

const router = useRouter()
const toastStore = useToastStore()
const authStore = useAuthStore()
const drawer = ref(false)

// Get user info from the auth store
const userName = computed(() => {
  if (authStore.user) {
    return authStore.user.name || authStore.user.username || 'Usuário'
  }
  return 'Usuário'
})

const userEmail = computed(() => {
  return authStore.user?.email || 'usuario@exemplo.com'
})

// Define all available menus
const allMenus = [
  {
    title: 'Dashboard',
    icon: mdiHome,
    to: { name: 'dashboard' },
    requiresAuth: true,
    roles: [] // Empty array means all authenticated users
  },
  {
    title: 'Status',
    icon: mdiTag,
    to: { name: 'status-list' },
    requiresAuth: true,
    roles: ['admin'] // Only admin can access
  },
  {
    title: 'Especialidades',
    icon: mdiAccountTag,
    to: { name: 'specialty-list' },
    requiresAuth: true,
    roles: [] // All authenticated users
  },
  {
    title: 'Pacientes',
    icon: mdiPacMan,
    to: { name: 'patient-list' },
    requiresAuth: true,
    roles: [] // All authenticated users
  },
  {
    title: 'Médicos',
    icon: mdiDoctor,
    to: { name: 'doctor-list' },
    requiresAuth: true,
    roles: [] // All authenticated users
  }
]

// Filter menus based on user's permissions
const menus = computed(() => {
  return allMenus.filter((menu) => {
    // If no roles are specified or roles array is empty, anyone can see it
    if (!menu.roles || menu.roles.length === 0) return true

    // Otherwise check if user has any of the required roles
    return menu.roles.some((role) => authStore.hasRole(role))
  })
})

// Logout function
const logout = async () => {
  // Use the auth store's logout function
  await authStore.logout()

  // Show success message
  toastStore.setToast({
    type: 'success',
    text: 'Logout realizado com sucesso!'
  })

  // Redirect to login
  router.push('/login')
}

// Load user data on mount
onMounted(() => {
  // This ensures user data is up to date with what's in the store
  if (authStore.isAuthenticated) {
    // Optional: validate token or refresh user data
    authStore.validateToken()
  }
})
</script>

<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar elevation="2">
      <template #prepend>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </template>

      <v-app-bar-title>
        <div class="d-flex align-center">
          <img src="@/assets/logo.svg" alt="ClinAgenda" height="32" class="me-2" />
          <span class="font-weight-bold">ClinAgenda</span>
        </div>
      </v-app-bar-title>

      <template #append>
        <v-menu>
          <template #activator="{ props }">
            <v-btn icon v-bind="props">
              <v-avatar color="primary" size="32">
                <span class="text-white">{{ authStore.userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-title>
                <div class="font-weight-bold">{{ userName }}</div>
                <div class="text-caption">{{ userEmail }}</div>
              </v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title>Perfil</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>Configurações</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="logout">
              <v-list-item-title>Sair</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list>
        <v-list-item prepend-avatar="@/assets/logo.svg" :title="userName" :subtitle="userEmail">
          <template v-if="authStore.isAdmin" #append>
            <v-chip color="primary" size="small">Admin</v-chip>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="menu in menus"
          :key="menu.title"
          :prepend-icon="menu.icon"
          :to="menu.to"
          color="primary"
          :title="menu.title"
        />
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <v-container fluid>
        <v-row>
          <v-col cols="12">
            <!-- Page Header -->
            <div class="d-flex align-center justify-space-between mb-4">
              <div>
                <h1 class="text-h4">
                  <slot name="title">ClinAgenda</slot>
                </h1>
              </div>
              <div>
                <slot name="action"></slot>
              </div>
            </div>

            <!-- Page Content -->
            <slot></slot>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="text-center d-flex flex-column">
      <div>
        <small>
          &copy; {{ new Date().getFullYear() }} ClinAgenda - Sistema para Controle de Pacientes e
          Recpeção - Desenvolvido por Diego Furukawa inc.
        </small>
      </div>
    </v-footer>

    <!-- Toast component -->
    <ClinicToast />
  </v-app>
</template>

<style lang="scss">
// Estilos em linha para evitar o uso da diretiva @import
// Variáveis e mixins específicos para este componente
$standard-easing: cubic-bezier(0.4, 0, 0.2, 1);
$transition-fast: 0.15s $standard-easing;

// Classes específicas deste componente
.font-weight-bold {
  font-weight: 600;
}

// Você pode incluir outras classes específicas conforme necessário...
</style>
