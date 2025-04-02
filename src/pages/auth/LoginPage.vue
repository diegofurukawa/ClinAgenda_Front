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
            Entrar
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import { mdiAccount, mdiLock, mdiEye, mdiEyeOff } from '@mdi/js'

const router = useRouter()
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
    const success = await authStore.login({
      username: username.value,
      password: password.value
    })

    if (success) {
      if (remember.value) {
        localStorage.setItem('clinagenda_remember', 'true')
      }

      toastStore.setToast({
        type: 'success',
        text: 'Login realizado com sucesso!'
      })

      router.push('/')
    } else {
      loginError.value = true
    }
  } catch (error) {
    console.error('Login error:', error)
    loginError.value = true
  } finally {
    loading.value = false
  }
}

// Check for remember me
onMounted(() => {
  const remembered = localStorage.getItem('clinagenda_remember')
  if (remembered) {
    remember.value = true
  }
})
</script>
