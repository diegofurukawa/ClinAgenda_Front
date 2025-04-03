<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { useAuthStore } from '@/stores/auth'
import ClinicToast from '@/components/ClinicToast.vue'
import { mdiAccountTag, mdiGroup, mdiHome, mdiPacMan } from '@mdi/js'

// Importar estilos - Método moderno para evitar avisos de depreciação
// @use "@/styles/settings.scss";

const router = useRouter()
const toastStore = useToastStore()
const authStore = useAuthStore()
const drawer = ref(false)

// User state - this would normally come from a user store
const userName = ref('Usuário')
const userEmail = ref('usuario@exemplo.com')

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

const menus = ref([
  {
    title: 'Dashboard',
    icon: mdiHome,
    to: { name: 'dashboard' }
  },
  {
    title: 'Status',
    icon: mdiAccountTag,
    to: { name: 'status-list' }
  },
  {
    title: 'Specialty',
    icon: mdiGroup,
    to: { name: 'specialty-list' }
  },
  {
    title: 'Patient',
    icon: mdiPacMan,
    to: { name: 'patient-list' }
  }
])

// Load user data on mount
onMounted(() => {
  if (authStore.user) {
    userEmail.value = authStore.user.email || 'usuario@exemplo.com'
    userName.value =
      authStore.user.name ||
      authStore.user.username ||
      (authStore.user.email ? authStore.user.email.split('@')[0] : 'Usuário')
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
          <span class="font-weightconst-bold">ClinAgenda</span>
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

    <router-view></router-view>

    <!-- Footer -->
    <v-footer app class="text-center d-flex flex-column">
      <div>
        <small
          >&copy; {{ new Date().getFullYear() }} ClinAgenda - Sistema para Controle de Pacientes e
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
.font-weightconst-bold {
  font-weight: 600;
}

// Você pode incluir outras classes específicas conforme necessário...
</style>

