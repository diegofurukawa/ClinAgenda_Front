<script setup lang="ts">
import { ref, onMounted, computed, useSlots } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import ClinicToast from '@/components/ClinicToast.vue'
import {
  mdiAccountTag,
  mdiHome,
  mdiDoctor,
  mdiTag,
  mdiLogout,
  mdiClockOutline,
  mdiHuman
} from '@mdi/js'

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
    title: 'Agendamento',
    icon: mdiClockOutline,
    to: { name: 'appointment-list' },
    requiresAuth: true,
    roles: ['admin']
  },
  {
    title: 'Pacientes',
    icon: mdiHuman,
    to: { name: 'patient-list' },
    requiresAuth: true,
    roles: ['admin']
  },
  {
    title: 'Médicos',
    icon: mdiDoctor,
    to: { name: 'doctor-list' },
    requiresAuth: true,
    roles: ['admin']
  },
  {
    title: 'Dashboard',
    icon: mdiHome,
    to: { name: 'dashboard' },
    requiresAuth: true,
    roles: [] // All authenticated users
  },
  {
    title: 'Especialidades',
    icon: mdiAccountTag,
    to: { name: 'specialty-list' },
    requiresAuth: false,
    roles: []
  },
  {
    title: 'Status',
    icon: mdiTag,
    to: { name: 'status-list' },
    requiresAuth: true,
    roles: [] // Only admin can access
  }
]

const slots = useSlots()
const contentClass = computed(() => {
  return slots.action || slots.title ? 'pt-4' : ''
})

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
  <v-app-bar color="primary" prominent>
    <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />

    <v-toolbar-title>ClinAgenda</v-toolbar-title>

    <v-spacer />

    <v-btn :icon="mdiLogout" variant="text" @click="logout" />

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

  <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined">
    <v-list>
      <v-list-item prepend-avatar="@/assets/logo.svg" :title="userName" :subtitle="userEmail">
        <template v-if="authStore.isAdmin" #append>
          <v-chip color="primary" size="small">Admin</v-chip>
        </template>
      </v-list-item>
    </v-list>

    <v-list>
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

  <v-main>
    <div class="pa-6">
      <div class="header">
        <div class="header__title text-h4"><slot name="title" /></div>
        <div class="header__action">
          <slot name="action" />
        </div>
      </div>

      <div class="content" :class="contentClass">
        <slot />
      </div>
    </div>

    <!-- Footer -->
    <v-footer app class="text-center d-flex flex-column">
      <div>
        <small>
          &copy; {{ new Date().getFullYear() }} ClinAgenda - Sistema para Controle de Pacientes e
          Recepção - Desenvolvido por Diego Furukawa inc.
        </small>
      </div>
    </v-footer>

    <clinic-toast />
  </v-main>
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

