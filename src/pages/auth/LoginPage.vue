<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import useToastStore from '@/stores/toast'
import { mdiAccount, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

// Form state
const form = ref()
const formValid = ref(false)
const username = ref('')
const password = ref('')
const showPassword = ref(false)
const remember = ref(false)
const loading = ref(false)
const loginError = ref(false)

// Handle redirect destination
const redirectPath = ref('/')

// Form validation rules
const rules = {
  required: (v: string) => !!v || 'Este campo é obrigatório',
  min: (v: string) => v.length >= 6 || 'A senha deve ter pelo menos 6 caracteres'
}

// Login logic
async function handleLogin() {
  if (!formValid.value) return

  loading.value = true
  loginError.value = false

  try {
    console.log('Tentando login com:', { username: username.value })

    const success = await authStore.login({
      username: username.value,
      password: password.value
    })

    console.log('Resultado do login:', success)

    if (success) {
      if (remember.value) {
        localStorage.setItem('clinagenda_remember', 'true')
      }

      toastStore.setToast({
        type: 'success',
        text: 'Login realizado com sucesso!'
      })

      // Garantir que o redirecionamento aconteça após um breve delay
      // para que o usuário possa ver a mensagem de sucesso
      setTimeout(() => {
        // Redirect to the stored path or default to dashboard
        const savedRedirect = localStorage.getItem('clinagenda_redirect_after_login')
        if (savedRedirect) {
          localStorage.removeItem('clinagenda_redirect_after_login')
          console.log('Redirecionando para URL salva:', savedRedirect)
          router.push(savedRedirect)
        } else {
          // Redirecionamento explícito para o dashboard
          console.log('Redirecionando para dashboard...')
          router.push({ name: 'dashboard' })
        }
      }, 1000) // Delay de 1 segundo para permitir que o toast seja exibido
    } else {
      console.log('Login falhou, exibindo mensagem de erro')
      loginError.value = true
      toastStore.setToast({
        type: 'error',
        text: 'Usuário ou senha incorretos. Por favor, tente novamente.'
      })
    }
  } catch (error) {
    console.error('Erro ao processar login:', error)
    loginError.value = true
    toastStore.setToast({
      type: 'error',
      text: 'Ocorreu um erro ao processar o login. Por favor, tente novamente.'
    })
  } finally {
    loading.value = false
  }
}

// Check for remember me and redirect after login
onMounted(() => {
  console.log('Login page mounted - Authentication status:', authStore.isAuthenticated)

  // If user is already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    console.log('Usuário já autenticado durante a montagem, redirecionando para dashboard')
    // Usar setTimeout para garantir que o redirecionamento aconteça após a renderização inicial
    setTimeout(() => {
      router.push({ name: 'dashboard' })
    }, 100)
    return
  }

  // Check if there's a redirect path in the query
  if (route.query.redirect && typeof route.query.redirect === 'string') {
    redirectPath.value = route.query.redirect
    localStorage.setItem('clinagenda_redirect_after_login', redirectPath.value)
    console.log('Redirect path saved:', redirectPath.value)
  }

  // Check for remembered login
  const remembered = localStorage.getItem('clinagenda_remember')
  if (remembered) {
    remember.value = true
  }

  // Focus username field automatically
  setTimeout(() => {
    const usernameInput = document.querySelector('input[type="text"]') as HTMLInputElement
    if (usernameInput) {
      usernameInput.focus()
    }
  }, 100)
})
</script>

<template>
  <div class="d-flex fill-height align-center justify-center">
    <v-card width="400" class="pa-4">
      <v-card-title class="text-center pb-6">
        <div class="d-flex justify-center">
          <v-img src="@/assets/logo.svg" max-width="150" />
        </div>
        <div class="mt-4 text-h5">Login do Sistema</div>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="formValid" @submit.prevent="handleLogin">
          <v-text-field
            v-model="username"
            label="Usuário"
            placeholder="Digite seu nome de usuário"
            :readonly="loading"
            :rules="[rules.required]"
            variant="outlined"
            :prepend-inner-icon="mdiAccount"
            class="mb-3"
          />

          <v-text-field
            v-model="password"
            label="Senha"
            placeholder="Digite sua senha"
            :readonly="loading"
            :rules="[rules.required, rules.min]"
            :type="showPassword ? 'text' : 'password'"
            variant="outlined"
            :prepend-inner-icon="mdiLock"
            :append-inner-icon="showPassword ? mdiEyeOff : mdiEye"
            @click:append-inner="showPassword = !showPassword"
            @keyup.enter="handleLogin"
          />

          <v-checkbox
            v-model="remember"
            label="Lembrar-me"
            color="primary"
            hide-details
            class="mt-1 mb-3"
          />

          <v-alert
            v-if="loginError"
            type="error"
            class="mb-3"
            title="Erro no login"
            text="Usuário ou senha incorretos. Por favor, tente novamente."
            variant="tonal"
            closable
            @click:close="loginError = false"
          />

          <v-btn
            color="primary"
            block
            type="submit"
            :loading="loading"
            :disabled="!formValid"
            class="mt-4"
          >
            ENTRAR
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.v-card {
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1) !important;
}

.v-card-title {
  font-weight: 600;
}
</style>

