<template>
  <div>
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
                <span class="text-white">{{ userInitials }}</span>
              </v-avatar>
            </v-btn>
          </template>
          <v-list>
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
        <v-list-item
          prepend-avatar="@/assets/logo.svg"
          :title="userName"
          :subtitle="userEmail"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item to="/" prepend-icon="mdi-view-dashboard" title="Dashboard"></v-list-item>
        <v-list-item prepend-icon="mdi-calendar-clock" title="Agendamentos"></v-list-item>
        <v-list-item prepend-icon="mdi-account-group" title="Pacientes"></v-list-item>
        <v-list-item prepend-icon="mdi-doctor" title="Médicos"></v-list-item>
        <v-list-item prepend-icon="mdi-cog" title="Configurações"></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid>
        <slot></slot>
      </v-container>
    </v-main>

    <!-- Footer -->
    <v-footer app class="text-center d-flex flex-column">
      <div>
        <small>&copy; {{ new Date().getFullYear() }} ClinAgenda - Bootcamp DEVPIRA + PECEGE</small>
      </div>
    </v-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const toastStore = useToastStore()
const drawer = ref(false)

// User state - this would normally come from a user store
const userName = ref('Usuário')
const userEmail = ref('usuario@exemplo.com')

// Computed property for user initials
const userInitials = computed(() => {
  if (!userName.value) return '?'
  return userName.value
    .split(' ')
    .map((name) => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

// Logout function
const logout = () => {
  // Clear auth data
  localStorage.removeItem('clinagenda_user')
  localStorage.removeItem('clinagenda_remember')

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
  const userData = localStorage.getItem('clinagenda_user')
  if (userData) {
    const user = JSON.parse(userData)
    if (user.email) {
      userEmail.value = user.email
      // Extract name from email for demo
      userName.value = user.email.split('@')[0].replace('.', ' ')
    }
  }
})
</script>
